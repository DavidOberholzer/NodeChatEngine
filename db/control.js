const utils = require('./utils');
const logStyle = require('../constants');
const sha256 = require('sha256');

const client = require('./client');

let db = null;

let messageBuffer = [];

module.exports = {
    getDB: () => {
        if (!db) {
            // console.log(logStyle.FgYellow, 'Connecting to chatengine DB.');
            db = client.client;
            db.connect();
            // console.log(logStyle.FgGreen, 'SUCCESS: Connected to DB');
        }
        return db;
    },
    setup: () => {
        let dbActions = [];
        let tables = utils.readFile('./db/db_data/tables.json');
        Object.entries(tables).map(table => {
            let queryString = 'CREATE TABLE IF NOT EXISTS ' + table[0] + ' (\n';
            let primaryKey = '';
            let foreignKeys = '';
            Object.entries(table[1]).map(field => {
                queryString +=
                    '\t' +
                    field[0] +
                    ' ' +
                    field[1].type +
                    (field[1].required ? ' NOT NULL' : '') +
                    (field[1].default ? ' DEFAULT ' + field[1].default : '') +
                    (field[1].unique ? ' UNIQUE' : '') +
                    ',\n';
                if (primaryKey === '' && field[1].primaryKey) {
                    primaryKey = '\tPRIMARY KEY (' + field[0] + ')';
                }
                if (field[1].foreignKey) {
                    foreignKeys +=
                        '\tFOREIGN KEY (' +
                        field[0] +
                        ') REFERENCES ' +
                        field[1].foreignKey +
                        ',\n';
                }
            });
            queryString +=
                primaryKey + (foreignKeys ? ',\n ' + foreignKeys.slice(0, -2) : '') + ');';
            // Debugging console logs
            // console.log(logStyle.FgYellow, 'CREATING TABLE WITH QUERY: ');
            // console.log(queryString);
            dbActions.push(
                db
                    .query(queryString)
                    .then(res => {
                        // Debugging console logs
                        // console.log(logStyle.FgGreen, 'SUCCESS: Created table ' + table[0]);
                    })
                    .catch(e => console.log(logStyle.FgRed, e))
            );
        });
        let password = sha256('admin');
        // loadTableData('member', [
        //     {
        //         username: 'admin',
        //         password: password,
        //         email: 'davidoberholzertest@gmail.com'
        //     }
        // ]);
        return Promise.all(dbActions);
    },
    connect: workflowID => {
        let query = 'SELECT * FROM state WHERE workflowid=' + workflowID + ' AND startstate=true;';
        stateQuery(query, 'Start State Retrieved');
    },
    sendMessage: message => {
        if (message.goto) {
            let queryString = 'SELECT * FROM state WHERE id=' + message.goto + ';';
            stateQuery(queryString, 'State Retrieved');
        } else {
            messageBuffer.push({
                text: 'Message not valid without goto!'
            });
        }
    },
    getMessageBuffer: () => {
        const messages = messageBuffer;
        messageBuffer = [];
        return messages;
    },
    loadData: fileDir => {
        const data = utils.readFile(fileDir);
        const tables = Object.entries(data);
        let allQueries = [];
        tables.map(([tableName, tableData], index) => {
            // console.log(logStyle.FgYellow, 'Loading Table Data for ' + tableName);
            tableData.map(row => {
                let queryString1 = 'INSERT INTO ' + tableName + ' (';
                let queryString2 = 'VALUES (';
                Object.entries(row).map(([columnName, columnValue]) => {
                    queryString1 += columnName + ', ';
                    let value = columnValue.toString();
                    if (tableName === 'member' && columnName === 'password') {
                        value = sha256(value);
                    } else {
                        value = utils.escapeRegExp(value);
                    }
                    queryString2 += "'" + value + "', ";
                });
                let queryString =
                    queryString1.slice(0, -2) + ')\n' + queryString2.slice(0, -2) + ');';
                // console.log(queryString);
                allQueries.push(
                    db
                        .query(queryString)
                        .then(res => {
                            // console.log(logStyle.FgGreen, 'Loaded Entry');
                        })
                        .catch(e => {
                            // console.log(logStyle.FgYellow, e);
                        })
                );
            });
            // console.log(logStyle.FgGreen, 'Loaded Table Data for ' + tableName);
        });
        return Promise.all(allQueries);
    },
    loadUser: user => {
        let queryString = `INSERT INTO member (username, password, email) VALUES ('${
            user.username
        }', '${user.password}', '${user.email}');`;
        return db.query(queryString);
    },
    clean: () => {
        const tables = ['button', 'state', 'workflow', 'member'];
        let allQueries = [];
        tables.map(tableName => {
            const queryString = `DELETE FROM ${tableName}`;
            allQueries.push(db.query(queryString));
        });
        return Promise.all(allQueries);
    }
};

const stateQuery = (query, successMessage) => {
    db.query(query)
        .then(res => {
            // console.log(logStyle.FgGreen, successMessage);
            buttonQuery(res.rows[0]);
        })
        .catch(e => {
            console.log(e);
            let result = {};
            result['text'] = 'Something went wrong! Please try again later.';
            addToMessageBuffer(result);
        });
};

const buttonQuery = state => {
    const query = 'SELECT * FROM button WHERE stateid=' + state.id + ';';
    const appendButtons = buttons => {
        state['buttons'] = buttons;
        addToMessageBuffer(state);
    };
    db.query(query)
        .then(res => {
            appendButtons(res.rows);
        })
        .catch(e => {
            console.log(e);
            appendButtons([]);
        });
};

const addToMessageBuffer = message => {
    messageBuffer.push(message);
};
