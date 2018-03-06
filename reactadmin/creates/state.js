import React from 'react';

import {
    Create,
    SimpleForm,
    BooleanInput,
    ReferenceInput,
    LongTextInput,
    TextInput,
    SelectInput
} from 'admin-on-rest';

const validationCreateState = values => {
    const errors = {};
    if (!values.id) {
        errors.id = ['An ID is required.'];
    } else if (isNaN(values.id)) {
        errors.id = ['An ID must be an integer.'];
    }
    if (!values.name) {
        errors.name = ['A name is required.'];
    }
    if (!values.workflowid) {
        errors.workflowid = ['This state must belong to a workflow'];
    }
    return errors;
};

export const StateCreate = props => (
    <Create title="Create New State" {...props}>
        <SimpleForm validate={validationCreateState}>
            <TextInput source="id" />
            <TextInput source="name" />
            <LongTextInput source="text" />
            <BooleanInput source="startstate" label="Is Start State" />
            <ReferenceInput
                source="auto"
                label="Auto Goto State"
                reference="states"
                target="workflowid"
                allowEmpty
            >
                <SelectInput source="id" optionText="name" />
            </ReferenceInput>
            <ReferenceInput
                source="workflowid"
                label="Workflow"
                reference="workflows"
                allowEmpty
            >
                <SelectInput source="id" optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);
