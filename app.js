const bodyParser = require('body-parser');
const express = require('express');
const DBcontroller = require('./db/control');
const logStyle = require('./constants');

let app = express();

const expressWs = require('express-ws')(app);

let db = DBcontroller.getDB();
DBcontroller.setup();

app.use(bodyParser.json());

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
    DBcontroller.connect(1);
    const receiveMessage = setInterval(() => {
        let messageList = DBcontroller.getMessageBuffer();
        if (messageList.length > 0) {
            console.log(messageList);
        }
        messageList.map((message, index) => {
            wss.send(JSON.stringify(message));
            if (index === messageList.length - 1) {
                if (message.auto) {
                    DBcontroller.sendMessage({ goto: message.auto });
                }
            }
        });
    }, 200);
    wss.on('message', message => {
        try {
            let message_data = JSON.parse(message);
            DBcontroller.sendMessage(message_data);
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

/* API code for Admin on Rest! */

const apiVer = '/api/v1';

// Utils functions for API queries.

const getItems = (table, filters = null, sort = null, limit = null) => {
    let query = `SELECT * FROM ${table} \n${filters ? `WHERE ` : ''}`;
    // Add all filters to WHERE clause.
    if (filters) {
        filters = Object.entries(filters);

        filters.map((filter, index) => {
            if (!(filter[1] instanceof Array)) {
                query += `${filter[0]} = ${filter[1]} OR `;
            } else {
                filter[1].map(value => {
                    query += `${filter[0]} = ${filter[1]} AND `;
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
    console.log(query);
    return db.query(query);
};

const updateItem = (table, body, id) => {
    query = `UPDATE ${table}\nSET `;
    Object.entries(body).map(field => {
        query += `${field[0]} = '${field[1]}', `;
    });
    query = `${query.slice(0, -2)}\nWHERE id=${id};`;
    console.log(query);
    return db.query(query);
};

const createItem = (table, body, id) => {
    let query1 = `INSERT INTO ${table} (id, `;
    let query2 = `VALUES ('${id}', `;
    Object.entries(body).map(field => {
        query1 += `${field[0]}, `;
        query2 += `'${field[1]}', `;
    });
    query = `${query1.slice(0, -2)})\n${query2.slice(0, -2)});`;
    console.log(query);
    return db.query(query);
};

const deleteItem = (table, id) => {
    let query = `DELETE FROM ${table}\nWHERE id=${id}`;
    return db.query(query);
};

// Actual API endpoints.

app.get(`${apiVer}/workflows`, (req, res) => {
    let query = req.query;
    let filters = query.filter ? JSON.parse(`{${query.filter}}`) : null;
    let sort = query.sort ? JSON.parse(query.sort) : null;
    let limit = query.range ? JSON.parse(query.range)[1] : null;
    let send = data => res.send(data);
    getItems('workflow', filters, sort, limit)
        .then(data => send(data.rows))
        .catch(err => {
            console.log(err);
            send(err);
        });
});

app.get(`${apiVer}/workflows/:ID`, (req, res) => {
    let workflowID = req.params.ID;
    let send = data => res.send(data);
    getItems('workflow', { id: workflowID })
        .then(data => send(data.rows[0]))
        .catch(err => {
            console.log(err);
            send(err);
        });
});

app.post(`${apiVer}/workflows/:ID`, (req, res) => {
    if (req.body) {
        let workflowID = req.params.ID;
        let send = data => res.send(data);
        createItem('workflow', req.body, workflowID)
            .then(data => send(data.rows[0]))
            .catch(err => {
                console.log(err);
            });
    } else {
        res.send({ code: 400, message: 'No Body found' });
    }
});

app.put(`${apiVer}/workflows/:ID`, (req, res) => {
    if (req.body) {
        let workflowID = req.params.ID;
        let send = data => res.send(data);
        updateItem('workflow', req.body, workflowID)
            .then(data => send(data))
            .catch(err => {
                console.log(err);
            });
    } else {
        res.send({ code: 400, message: 'No Body found' });
    }
});

app.delete(`${apiVer}/workflows/:ID`, (req, res) => {
    let workflowID = req.params.ID;
    let send = data => res.send(data);
    deleteItem('workflow', workflowID)
        .then(data => {
            send({
                code: 200,
                message: `Successfully removed workflow ID: ${workflowID}`
            });
        })
        .catch(err => {
            console.log(err);
            send(err);
        });
});

app.get(`${apiVer}/states`, (req, res) => {
    let query = req.query;
    let filters = query.filter ? JSON.parse(`{${query.filter}}`) : null;
    let sort = query.sort ? JSON.parse(query.sort) : null;
    let limit = query.range ? JSON.parse(query.range)[1] : null;
    let send = data => res.send(data);
    getItems('state', filters, sort, limit)
        .then(data => send(data.rows))
        .catch(err => {
            console.log(err);
            send(err);
        });
});

app.get(`${apiVer}/states/:ID`, (req, res) => {
    let stateID = req.params.ID;
    let send = data => res.send(data);
    getItems('state', stateID)
        .then(data => send(data.rows[0]))
        .catch(err => {
            console.log(err);
            send(err);
        });
});

app.post(`${apiVer}/states/:ID`, (req, res) => {
    if (req.body) {
        let stateID = req.params.ID;
        let send = data => res.send(data);
        createItem('state', req.body, stateID)
            .then(data => send(data.rows[0]))
            .catch(err => {
                console.log(err);
            });
    } else {
        res.send({ code: 400, message: 'No Body found' });
    }
});

app.put(`${apiVer}/states/:ID`, (req, res) => {
    if (req.body) {
        let stateID = req.params.ID;
        let send = data => res.send(data);
        updateItem('state', req.body, stateID)
            .then(data => send(data))
            .catch(err => {
                console.log(err);
            });
    } else {
        res.send({ code: 400, message: 'No Body found' });
    }
});

app.delete(`${apiVer}/states/:ID`, (req, res) => {
    let stateID = req.params.ID;
    let send = data => res.send(data);
    deleteItem('state', stateID)
        .then(data => {
            send({
                code: 200,
                message: `Successfully removed state ID: ${stateID}`
            });
        })
        .catch(err => {
            console.log(err);
            send(err);
        });
});

app.get(`${apiVer}/buttons`, (req, res) => {
    let query = req.query;
    let filters = query.filter ? JSON.parse(`{${query.filter}}`) : null;
    let sort = query.sort ? JSON.parse(query.sort) : null;
    let limit = query.range ? JSON.parse(query.range)[1] : null;
    let send = data => res.send(data);
    getItems('button', filters, sort, limit)
        .then(data => send(data.rows))
        .catch(err => {
            console.log(err);
        });
});

app.get(`${apiVer}/buttons/:ID`, (req, res) => {
    let stateID = req.params.ID;
    let send = data => res.send(data);
    getItems('button', stateID)
        .then(data => send(data.rows[0]))
        .catch(err => {
            console.log(err);
        });
});

app.post(`${apiVer}/buttons/:ID`, (req, res) => {
    if (req.body) {
    } else {
        res.send({ code: 400, message: 'No Body found' });
    }
});

app.put(`${apiVer}/buttons/:ID`, (req, res) => {
    if (req.body) {
    } else {
        res.send({ code: 400, message: 'No Body found' });
    }
});

app.delete(`${apiVer}/buttons/:ID`, (req, res) => {
    let butotnID = req.params.ID;
    let send = data => res.send(data);
    deleteItem('button', buttonID)
        .then(data => {
            send({
                code: 200,
                message: `Successfully removed button ID: ${buttonID}`
            });
        })
        .catch(err => {
            console.log(err);
            send(err);
        });
});

module.exports = app;

app.listen(3000);

console.log(logStyle.FgBlue, 'Node Portal Server listening on port 3000...');
