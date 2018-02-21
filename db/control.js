const utils = require('./utils');
const logStyle = require('../constants');
const functions = require('../app');

const client = require('./client');

const db = client.client;

let messageBuffer = [];

console.log(logStyle.FgYellow, 'Connecting to chatengine DB.');
db.connect();
console.log(logStyle.FgGreen, 'SUCCESS: Connected to DB');

module.exports = {
    setup: () => {
        let tables = utils.readFile('./db/db_data/tables.json');
        Object.entries(tables).map(table => {
            db
                .query('DROP TABLE ' + table[0] + ';')
                .then(res => {
                    console.log('Dropped table %s', table[0]);
                })
                .catch(e => {
                    // Ignore errors.
                });
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
                primaryKey +
                (foreignKeys ? ',\n ' + foreignKeys.slice(0, -2) : '') +
                ');';
            console.log(logStyle.FgYellow, 'CREATING TABLE WITH QUERY: ');
            console.log(queryString);
            db
                .query(queryString)
                .then(res => {
                    console.log(
                        logStyle.FgGreen,
                        'SUCCESS: Created table ' + table[0]
                    );
                })
                .catch(e => console.log(logStyle.FgRed, e));
        });
        loadData();
    },
    connect: workflowID => {
        let query =
            'SELECT * FROM state WHERE workflowid=' +
            workflowID +
            ' AND startstate=true;';
        stateQuery(query, 'Start State Retrieved');
    },
    sendMessage: message => {
        if (message.goto) {
            let queryString =
                'SELECT * FROM state WHERE id=' + message.goto + ';';
            stateQuery(queryString, 'State Retrieved');
        } else {
            messageBuffer.push({
                text: 'Message not valid without goto!'
            });
        }
    },
    getMessageBuffer: () => {
        let messages = messageBuffer;
        messageBuffer = [];
        return messages;
    }
};

const loadTableData = (tableName, tableData) => {
    console.log(logStyle.FgYellow, 'Loading Table Data for ' + tableName);
    tableData.map(row => {
        let queryString1 = 'INSERT INTO ' + tableName + ' (';
        let queryString2 = 'VALUES (';
        Object.entries(row).map(column => {
            queryString1 += column[0] + ', ';
            let value = utils.escapeRegExp(column[1].toString());
            queryString2 += "'" + value + "', ";
        });
        let queryString =
            queryString1.slice(0, -2) +
            ')\n' +
            queryString2.slice(0, -2) +
            ');';
        console.log(queryString);
        db
            .query(queryString)
            .then(res => {
                console.log(logStyle.FgGreen, 'Loaded Entry');
            })
            .catch(e => {
                console.log(logStyle.FgYellow, e);
            });
    });
    console.log(logStyle.FgGreen, 'Loaded Table Data for ' + tableName);
};

const loadData = () => {
    let data = utils.readFile('./db/db_data/chatbots.json');
    let tables = Object.entries(data);
    tables.map((tableData, index) => {
        loadTableData(tableData[0], tableData[1]);
    });
};

const stateQuery = (query, successMessage) => {
    db
        .query(query)
        .then(res => {
            console.log(logStyle.FgGreen, successMessage);
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
    db
        .query(query)
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
