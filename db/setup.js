const DBcontroller = require('./control');

let db = DBcontroller.getDB();
DBcontroller.setup()
    .then(() => {
        console.log('All DB tables created!');
        if (process.env.NODE_ENV === 'test') {
            DBcontroller.loadData('./test/files/test-data.json').then(() => {
                console.log('All test data has been loaded!');
                process.exit();
            });
        } else {
            process.exit();
        }
    })
    .catch(error => {
        throw new Error(error);
    });
