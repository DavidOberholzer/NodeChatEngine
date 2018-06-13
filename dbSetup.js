const DBcontroller = require('./db/control');

let db = DBcontroller.getDB();
DBcontroller.setup();
