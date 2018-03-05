import React from 'react';
import {
    EditButton,
    List,
    Datagrid,
    DateField,
    TextField
} from 'admin-on-rest';

export const WorkflowList = props => (
    <List {...props} title="Chatbot Workflows">
        <Datagrid>
            <TextField source="id" />
            <DateField source="createdat" label="Created" />
            <TextField source="name" />
            <EditButton />
        </Datagrid>
    </List>
);
