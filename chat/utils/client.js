let webSocket = null;

const getWebSocketClient = (url, receiveHandler) => {
    if (!webSocket) {
        webSocket = new WebSocket(url);
        webSocket.onopen = () => {
            console.log('WebSocket connection opened!');
        };
        webSocket.onmessage = event => {
            receiveHandler(JSON.parse(event.data));
        };
        webSocket.onclose = () => {
            console.log('WebSocket Connection closed!');
        };
    }
    return webSocket;
};

export default getWebSocketClient;
