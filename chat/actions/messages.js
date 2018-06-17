import { MESSAGE_ADD, MESSAGE_CLEAR_ALL } from '../actionTypes';

export const messageAdd = message => {
    return {
        type: MESSAGE_ADD,
        payload: message
    };
};

export const messageClearAll = () => {
    return {
        type: MESSAGE_CLEAR_ALL
    };
};
