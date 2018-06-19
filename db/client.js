const { Client } = require('pg');

const database =
    process.env.NODE_ENV === 'test'
        ? {
              user: 'postgres',
              host: 'localhost',
              database: 'test',
              password: '',
              port: 5432
          }
        : {
              user: 'nodechatengine',
              host: 'localhost',
              database: 'nodechatengine',
              password: 'nodechatengine',
              port: 5432
          };

module.exports = {
    client: new Client(database)
};
