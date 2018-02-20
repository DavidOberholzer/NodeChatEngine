const bodyParser = require('body-parser');
const express = require('express');
const DBcontroller = require('./db/control');
const logStyle = require('./constants');

let app = express();

const expressWs = require('express-ws')(app);

DBcontroller.setup();

app.use(bodyParser.json());

app.ws('/echo', (wss, request) => {
    console.log(logStyle.FgGreen, 'Echo Websocket connection established!');
    wss.send('Welcome to the echo WebSocket!');
    wss.on('message', message => {
        console.log(`User sent message: ${message}`);
        wss.send(message);
        if (message === 'exit') {
            wss.close();
        }
    });
    wss.on('close', () => {
        console.log(logStyle.FgRed, 'Websocket disconnected');
    });
});

app.ws('/chat', (wss, request) => {
    console.log(logStyle.FgGreen, 'Chat Websocket Connection Established!');

    wss.on('message', message => {
        try {
            let message_data = JSON.parse(message);
        } catch (error) {
            console.log(logStyle.FgRed, 'Message format is not JSON.');
            wss.send(
                JSON.stringify({
                    status: 'error',
                    message: 'Message is not JSON format.'
                })
            );
        }
    });
    wss.on('close', () => {
        console.log(logStyle.FgRed, 'Websocket disconnected');
    });
});

module.exports = app;

app.listen(3000);

console.log(logStyle.FgBlue, 'Node Portal Server listening on port 3000...');
