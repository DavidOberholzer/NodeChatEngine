import { MESSAGE_ADD, MESSAGE_CLEAR_ALL } from '../actionTypes';

const initialState = {
    messages: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_ADD:
            return {
                messages: [
                    ...state.messages,
                    {
                        ...action.payload,
                        timeAdded: Date.now()
                    }
                ]
            };
        case MESSAGE_CLEAR_ALL:
            return {
                messages: []
            };
        default:
            return state;
    }
};
