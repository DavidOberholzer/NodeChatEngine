import React from 'react';
import {
    List,
    EditButton,
    Datagrid,
    BooleanField,
    DateField,
    ReferenceField,
    TextField
} from 'admin-on-rest';

export const StateList = props => (
    <List {...props} title="Chatbot States">
        <Datagrid>
            <TextField source="id" />
            <DateField source="createdat" label="Created" />
            <TextField source="name" />
            <TextField source="input" />
            <BooleanField source="startstate" label="Is Start State" />
            <ReferenceField source="auto" label="Auto Goto State" reference="state" allowEmpty>
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="workflowid" label="workflow" reference="workflow">
                <TextField source="name" />
            </ReferenceField>
            <EditButton />
        </Datagrid>
    </List>
);
