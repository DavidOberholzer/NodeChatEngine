const DBcontroller = require('./control');

let db = DBcontroller.getDB();
DBcontroller.clean().then(() => {
    console.log('Database cleaned!');
    process.exit();
});
