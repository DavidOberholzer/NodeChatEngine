const { Client } = require('pg');

const database =
    process.env.NODE_ENV === 'test'
        ? {
              user: 'test',
              host: 'localhost',
              database: 'test',
              password: 'test',
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
