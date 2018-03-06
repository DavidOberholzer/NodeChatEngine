import React from 'react';

import { Create, SimpleForm, DisabledInput, TextInput } from 'admin-on-rest';

const validateWorkflowCreation = values => {
    const errors = {};
    if (!values.id) {
        errors.id = ['An ID is required.'];
    } else if (isNaN(values.id)) {
        errors.id = ['An ID must be an integer.'];
    }
    if (!values.name) {
        errors.name = ['A name is required.'];
    }
    return errors;
};

export const WorkflowCreate = props => (
    <Create title="Create New Workflow" {...props}>
        <SimpleForm validate={validateWorkflowCreation}>
            <TextInput source="id" />
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);
