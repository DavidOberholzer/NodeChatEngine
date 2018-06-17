import { CHAT_WORKFLOW_CHANGE } from '../actionTypes';

export const chatChangeWorkflow = workflowID => ({
    type: CHAT_WORKFLOW_CHANGE,
    payload: workflowID
});
