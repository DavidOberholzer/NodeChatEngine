import { combineReducers, createStore } from 'redux';

import reducers from './reducers';

export const createStoreWithInitial = initialState =>
    createStore(
        reducers,
        initialState,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

const idToken = localStorage.getItem('token');

export default createStore(
    reducers,
    {
        auth: {
            idToken
        }
    },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
