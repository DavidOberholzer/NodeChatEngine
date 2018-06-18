const sha256 = require('sha256');
const DBController = require('./db/control');

const db = DBController.getDB();
const stdin = process.openStdin();
let input = 0;
const user = {};
console.log('Create SuperUser:');
console.log('Enter Username: ');

stdin.addListener('data', d => {
    switch (input) {
        case 0:
            user.username = d.toString().trim();
            console.log('Enter Password: ');
            break;
        case 1:
            user.password = sha256(d.toString().trim());
            console.log('Enter Email');
            break;
        case 2:
            user.email = d.toString().trim();
            DBController.loadUser(user).then(() => {
                console.log('User Added');
                process.exit();
            });
            break;
    }
    input++;
});
