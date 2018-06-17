import { CHAT_WORKFLOW_CHANGE, CHAT_WORKFLOWS_LOAD } from '../actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case CHAT_WORKFLOWS_LOAD:
            return {
				workflows: action.payload,
				workflowID: state.workflowID
            };
        case CHAT_WORKFLOW_CHANGE:
            return {
				workflows: state.workflows,
                workflowID: action.payload
            };
        default:
            return state;
    }
};
