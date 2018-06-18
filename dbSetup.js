const DBcontroller = require('./db/control');

let db = DBcontroller.getDB();
DBcontroller.setup().then(() => {
    console.log('All DB tables created!');
});
