let app = require('./app');

app.get('channels/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end()
});

app.get('channels/:channel_id/', (req, res) => {

});

app.get('channels/:channel_id/messages/', (req, res) => {

});

app.get('channels/:channel_id/userinfo/:recipient_id/', (req, res) => {

});

