const { Client } = require('pg');

module.exports = {
    client: new Client({
        user: 'nodechatengine',
        host: 'localhost',
        database: 'nodechatengine',
        password: 'nodechatengine',
        port: 5432
    })
};
