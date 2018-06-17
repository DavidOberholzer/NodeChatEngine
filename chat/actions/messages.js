import { MESSAGE_ADD } from '../actionTypes';

export const messageAdd = message => {
    return {
        type: MESSAGE_ADD,
        payload: message
    };
};
