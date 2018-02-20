const utils = require('./utils');
const logStyle = require('../constants');

const client = require('./client');

const db = client.client;

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
                .then(res =>
                    console.log(
                        logStyle.FgGreen,
                        ('SUCCESS: Created table %s!', table[0])
                    )
                )
                .catch(e => console.log(logStyle.FgRed, e));
        });
    },
    loadData: () => {
        let data = utils.readFile('./db/db_data/chatbots.json');
        let workflows = data.workflows;
        workflows.map(workflow => {
            let queryString = 'INSERT INTO workflow ()';
        });
    }
};
