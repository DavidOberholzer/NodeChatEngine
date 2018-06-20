require('./styles/main.scss');
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './App';
import WebSocket from './utils/client';
import { messageAdd } from './actions/messages';

const add = message => store.dispatch(messageAdd(message));
const websocketURL =
    process.env.NODE_ENV === 'prod'
        ? `wss://${window.location.href.split('/', 3)[2]}/chat`
        : `ws://${window.location.href.split('/', 3)[2]}/chat`;
WebSocket(websocketURL, add);

document.getElementById('Chat-div') &&
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('Chat-div')
    );
