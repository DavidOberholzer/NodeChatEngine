import { combineReducers } from 'redux';

import auth from './auth';
import chat from './chat';
import messages from './messages';

export default combineReducers({
    auth,
    chat,
    messages
});
