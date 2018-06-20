// All colour/style strings for console logs.
const urls = {
    prod: 'https://www.nodechatengine.tk',
    dev: 'http://localhost:3000',
    test: 'http://localhost:3000'
};
const url = urls[process.env.NODE_ENV || 'dev'];
console.log(url);

module.exports = {
    Reset: '\x1b,[0m%s\x1b[0m',
    Bright: '\x1b[1m%s\x1b[0m',
    Dim: '\x1b[2m%s\x1b[0m',
    Underscore: '\x1b[4m%s\x1b[0m',
    Blink: '\x1b[5m%s\x1b[0m',
    Reverse: '\x1b[7m%s\x1b[0m',
    Hidden: '\x1b[8m%s\x1b[0m',

    FgBlack: '\x1b[30m%s\x1b[0m',
    FgRed: '\x1b[31m%s\x1b[0m',
    FgGreen: '\x1b[32m%s\x1b[0m',
    FgYellow: '\x1b[33m%s\x1b[0m',
    FgBlue: '\x1b[34m%s\x1b[0m',
    FgMagenta: '\x1b[35m%s\x1b[0m',
    FgCyan: '\x1b[36m%s\x1b[0m',
    FgWhite: '\x1b[37m%s\x1b[0m',

    url
};
