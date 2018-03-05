import React from 'react';

import {
    Create,
    SimpleForm,
    BooleanInput,
    DisabledInput,
    ReferenceInput,
    TextInput,
    SelectInput
} from 'admin-on-rest';

export const StateCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="name" />
            <TextInput source="text" />
            <BooleanInput source="startstate" label="Is Start State" />
            <ReferenceInput
                source="auto"
                label="Auto Goto Workflow"
                reference="workflows"
            >
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput
                source="workflowid"
                label="Workflow"
                reference="workflows"
            >
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);
