import { CHAT_WORKFLOW_CHANGE } from '../actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case CHAT_WORKFLOW_CHANGE:
            return {
                workflowID: action.payload
            };
        default:
            return state;
    }
};
