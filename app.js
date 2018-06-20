const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const sha256 = require('sha256');
const util = require('util');
const uuidv1 = require('uuid/v1');

const DBcontroller = require('./db/control');
const logStyle = require('./constants');
const utils = require('./utils');

let app = express();

let server = process.env.NODE_ENV === 'prod' ? https.createServer(app) : http.createServer(app);

const expressWs = require('express-ws')(app, server);

let db = DBcontroller.getDB();

let tokens = {
    testtoken: null
};

process.title = 'NodeChatEngine';

setInterval(() => {
    let newTokens = tokens;
    Object.entries(tokens).map(([token, time]) => {
        if (token !== 'testtoken') {
            const now = new Date();
            if (now - time > 60000 * 30) {
                delete newTokens[token];
            }
        }
    });
    tokens = newTokens;
}, 1000);

app.use(bodyParser.json());
app.use(express.static('static'));

var corsOptions = {
    exposedHeaders: ['Content-Range', 'Token']
};
app.use(cors(corsOptions));

/* Websocket code for chatting to a bot! */

app.ws('/echo', (wss, request) => {
    console.log(logStyle.FgGreen, 'Echo Websocket connection established!');
    wss.send('Welcome to the echo WebSocket!');
    wss.on('message', message => {
        console.log(`User sent message: ${message}`);
        wss.send(message);
        if (message === 'exit') {
            wss.close();
        }
    });
    wss.on('close', () => {
        console.log(logStyle.FgRed, 'Websocket disconnected');
    });
});

app.ws('/chat', (wss, request) => {
    console.log(logStyle.FgGreen, 'Chat Websocket Connection Established!');
    let inputs = {};
    let firstMessage = true;
    const receiveMessage = setInterval(() => {
        let messageList = DBcontroller.getMessageBuffer();
        messageList.map((message, index) => {
            message = utils.loadVariables(message, inputs);
            wss.send(JSON.stringify(message));
            if (index === messageList.length - 1) {
                if (message.auto && !message.input) {
                    DBcontroller.sendMessage({ goto: message.auto });
                }
            }
        });
    }, 200);
    wss.on('message', message => {
        try {
            if (!(message instanceof Object)) {
                message = JSON.parse(message);
            }
            if (firstMessage) {
                firstMessage = false;
                DBcontroller.connect(message.workflowID);
            } else {
                if (message.text === '!reset') {
                    firstMessage = true;
                } else {
                    if (message.input) {
                        inputs[message.input] = message.text;
                    }
                    DBcontroller.sendMessage(message);
                }
            }
        } catch (error) {
            console.log(logStyle.FgRed, 'Message format is not JSON.');
            wss.send(
                JSON.stringify({
                    status: 'error',
                    message: 'Message is not JSON format.'
                })
            );
        }
    });
    wss.on('close', () => {
        console.log(logStyle.FgRed, 'Websocket disconnected');
        clearInterval(receiveMessage);
    });
});

/* Normal URL paths for site */

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile('index.html');
});

/* API code for Admin on Rest! */

const apiVer = '/api/v1';

// Utils functions for API queries.

const validToken = headers => {
    const existingTokens = new Set(Object.keys(tokens));
    const token = headers.authorization;
    if (token === 'testtoken') {
        return process.env.NODE_ENV === 'test' ? true : false;
    }
    return token && existingTokens.has(token.replace('Bearer ', '')) ? true : false;
};

const getFlow = (resource, req, res) => {
    let send = data => {
        res.header('Content-Range', data.length);
        res.send(data);
    };
    const allowed = validToken(req.headers);
    if (allowed) {
        let query = req.query;
        let filters = query.filter && query.filter !== '{}' ? JSON.parse(`${query.filter}`) : null;
        let sort = query.sort && query.sort !== '[]' ? JSON.parse(query.sort) : null;
        let limit = query.range && query.range !== '[]' ? JSON.parse(query.range)[1] : null;
        getItems(resource, filters, sort, limit)
            .then(data => send(data.rows))
            .catch(err => {
                console.log(err);
                send(err);
            });
    } else {
        res.statusCode = 403;
        res.send({ status: 403, message: 'Token Expired!' });
    }
};

const getSingleFlow = (resource, req, res) => {
    const allowed = validToken(req.headers);
    if (allowed) {
        let id = req.params.ID;
        let send = data => res.send(data);
        getItems(resource, { id: id })
            .then(data => send(data.rows[0]))
            .catch(err => {
                console.log(err);
                send(err);
            });
    } else {
        res.statusCode = 403;
        res.send({ status: 403, message: 'Token Expired!' });
    }
};

const postNewFlow = (resource, req, res) => {
    const allowed = validToken(req.headers);
    if (allowed) {
        if (req.body) {
            let send = data => res.send(data);
            createItem(resource, req.body)
                .then(data => {
                    getItems(resource, { id: req.body.id })
                        .then(data => send(data.rows[0]))
                        .catch(err => {
                            console.log(err);
                            send(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            res.send({ code: 400, message: 'No Body found' });
        }
    } else {
        res.statusCode = 403;
        res.send({ status: 403, message: 'Token Expired!' });
    }
};

const updateFlow = (resource, req, res) => {
    const allowed = validToken(req.headers);
    if (allowed) {
        if (req.body) {
            let id = req.params.ID;
            let send = data => res.send(data);
            updateItem(resource, req.body, id)
                .then(data => send(data))
                .catch(err => {
                    console.log(err);
                });
        } else {
            res.send({ code: 400, message: 'No Body found' });
        }
    } else {
        res.statusCode = 403;
        res.send({ status: 403, message: 'Token Expired!' });
    }
};

const deleteFlow = (resource, req, res) => {
    const allowed = validToken(req.headers);
    if (allowed) {
        let id = req.params.ID;
        let send = data => res.send(data);
        deleteItem(resource, id)
            .then(data => {
                send({
                    code: 200,
                    message: `Successfully removed ${resource} with ID: ${id}`
                });
            })
            .catch(err => {
                console.log(err);
                send(err);
            });
    } else {
        res.statusCode = 403;
        res.send({ status: 403, message: 'Token Expired!' });
    }
};

const getItems = (table, filters = null, sort = null, limit = null) => {
    let query = `SELECT * FROM ${table} \n${filters ? `WHERE ` : ''}`;
    // Add all filters to WHERE clause.
    if (filters) {
        filters = Object.entries(filters);
        filters.map((filter, index) => {
            if (!(filter[1] instanceof Array)) {
                query += `${filter[0]} = '${filter[1]}' AND `;
            } else {
                filter[1].map(value => {
                    query += `${filter[0]} = '${value}' OR `;
                });
            }
            if (index === filters.length - 1) {
                let querySlice = query.endsWith('OR ') ? -4 : -5;
                query = `${query.slice(0, querySlice)}`;
            }
        });
    }
    // Add all sorts to ORDER BY Clause.
    query = `${query}${sort ? '\nORDER BY ' : ''}`;
    if (sort) {
        sort.map(item => {
            query += `${item} `;
        });
        query = query.slice(0, -1);
    }
    // Add limit if specified.
    query = `${query}${limit ? `\nLIMIT ${limit};` : ';'}`;
    return db.query(query);
};

const updateItem = (table, body, id) => {
    query = `UPDATE ${table}\nSET `;
    Object.entries(body).map(field => {
        query += `${field[0]} = '${field[1]}', `;
    });
    query = `${query.slice(0, -2)}\nWHERE id=${id};`;
    return db.query(query);
};

const createItem = (table, body) => {
    let query1 = `INSERT INTO ${table} ( `;
    let query2 = `VALUES ( `;
    Object.entries(body).map(field => {
        query1 += `${field[0]}, `;
        query2 += `'${field[1]}', `;
    });
    query = `${query1.slice(0, -2)})\n${query2.slice(0, -2)});`;
    return db.query(query);
};

const deleteItem = (table, id) => {
    let query = `DELETE FROM ${table}\nWHERE id=${id}`;
    return db.query(query);
};

// Actual API endpoints.

app.post(`/authenticate`, (req, res) => {
    let sendSuccess = code => {
        let newToken = uuidv1();
        tokens[newToken] = new Date();
        res.statusCode = code;
        res.header('Content-Type', 'application/json');
        res.send({ token: newToken });
    };
    let sendFailure = (code, message) => {
        res.statusCode = code;
        res.send({ status: code, message });
    };
    if (req.body) {
        if (req.body.username && req.body.password) {
            getItems('member', { username: req.body.username })
                .then(data => {
                    if (data.rows.length > 0) {
                        data = data.rows[0];
                        let password = sha256(req.body.password);
                        if (password == data.password) {
                            sendSuccess(200, 'Success');
                        } else {
                            sendFailure(403, 'Incorrect Login Details');
                        }
                    } else {
                        sendFailure(403, 'User not found.');
                    }
                })
                .catch(err => {
                    console.log(err);
                    sendFailure(403, err);
                });
        } else {
            sendFailure(403, err);
        }
    } else {
        sendFailure(403, err);
    }
});

app.get(`${apiVer}/member`, (req, res) => {
    getFlow('member', req, res);
});

app.get(`${apiVer}/member/:ID`, (req, res) => {
    getSingleFlow('member', req, res);
});

app.post(`${apiVer}/member`, (req, res) => {
    postNewFlow('member', req, res);
});

app.put(`${apiVer}/member/:ID`, (req, res) => {
    updateFlow('member', req, res);
});

app.delete(`${apiVer}/member/:ID`, (req, res) => {
    deleteFlow('member', req, res);
});

app.get(`${apiVer}/workflow`, (req, res) => {
    getFlow('workflow', req, res);
});

app.get(`${apiVer}/workflow/:ID`, (req, res) => {
    getSingleFlow('workflow', req, res);
});

app.post(`${apiVer}/workflow`, (req, res) => {
    postNewFlow('workflow', req, res);
});

app.put(`${apiVer}/workflow/:ID`, (req, res) => {
    updateFlow('workflow', req, res);
});

app.delete(`${apiVer}/workflow/:ID`, (req, res) => {
    deleteFlow('workflow', req, res);
});

app.get(`${apiVer}/state`, (req, res) => {
    getFlow('state', req, res);
});

app.get(`${apiVer}/state/:ID`, (req, res) => {
    getSingleFlow('state', req, res);
});

app.post(`${apiVer}/state`, (req, res) => {
    postNewFlow('state', req, res);
});

app.put(`${apiVer}/state/:ID`, (req, res) => {
    updateFlow('state', req, res);
});

app.delete(`${apiVer}/state/:ID`, (req, res) => {
    deleteFlow('state', req, res);
});

app.get(`${apiVer}/button`, (req, res) => {
    getFlow('button', req, res);
});

app.get(`${apiVer}/button/:ID`, (req, res) => {
    getSingleFlow('button', req, res);
});

app.post(`${apiVer}/button`, (req, res) => {
    postNewFlow('button', req, res);
});

app.put(`${apiVer}/button/:ID`, (req, res) => {
    updateFlow('button', req, res);
});

app.delete(`${apiVer}/button/:ID`, (req, res) => {
    deleteFlow('button', req, res);
});

app.get('*', (req, res) => {
    res.redirect('/');
});

server.listen(3000);
console.log(logStyle.FgBlue, `${process.env.NODE_ENV} Node Chat Engine Server listening on port 3000...`);
