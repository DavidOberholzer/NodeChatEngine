import { CHAT_WORKFLOWS_LOAD, CHAT_WORKFLOW_CHANGE } from '../actionTypes';

export const chatWorkflowsLoad = workflows => ({
	type: CHAT_WORKFLOWS_LOAD,
	payload: workflows
})

export const chatChangeWorkflow = workflowID => ({
    type: CHAT_WORKFLOW_CHANGE,
    payload: workflowID
});
