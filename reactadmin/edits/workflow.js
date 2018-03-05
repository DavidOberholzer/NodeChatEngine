import React from 'react';

import {
    Edit,
    SimpleForm,
    BooleanField,
    DisabledInput,
    TextInput,
    ReferenceManyField,
    ReferenceField,
    Datagrid,
    TextField,
    DateField,
    EditButton
} from 'admin-on-rest';

export const WorkflowEdit = props => (
    <Edit title="Edit Workflow" {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <DisabledInput source="createdat" label="Created" />
            <TextInput source="name" />
            <ReferenceManyField
                label="States"
                reference="states"
                target="workflowid"
            >
                <Datagrid>
                    <TextField source="id" />
                    <DateField source="createdat" label="Created" />
                    <TextField source="name" />
                    <BooleanField source="startstate" label="Is Start State" />
                    <ReferenceField
                        source="auto"
                        label="Auto Goto Workflow"
                        reference="workflows"
                        allowEmpty={true}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);
