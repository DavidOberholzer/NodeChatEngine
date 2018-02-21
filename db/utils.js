const fs = require('fs');
const logStyle = require('../constants');

module.exports = {
    readFile: filePath => {
        console.log(logStyle.FgYellow, 'Started Reading DB Tables File');
        const content = fs.readFileSync(filePath);
        console.log(logStyle.FgGreen, 'DB Tables file read.');
        return JSON.parse(content);
    },
    escapeRegExp: value => {
        return value.replace(/[\']/g, "'$&");
    }
};
