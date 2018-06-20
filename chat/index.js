require('./styles/main.scss');
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './App';
import WebSocket from './utils/client';
import { messageAdd } from './actions/messages';

const add = message => store.dispatch(messageAdd(message));
const splitLocation = window.location.href.split('/', 3);
const websocketURL =
    splitLocation[0].indexOf('s') >= 0
        ? `wss://${splitLocation[2]}/chat`
        : `ws://${splitLocation[2]}/chat`;
console.log(websocketURL);
WebSocket(websocketURL, add);

document.getElementById('Chat-div') &&
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('Chat-div')
    );
