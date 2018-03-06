import React from 'react';
import {
    EditButton,
    List,
    Datagrid,
    BooleanField,
    DateField,
    ReferenceField,
    TextField
} from 'admin-on-rest';

export const ButtonList = props => (
    <List {...props} title="Buttons">
        <Datagrid>
            <TextField source="id" />
            <DateField source="createdat" label="Created" />
            <TextField source="text" />
            <ReferenceField source="goto" reference="states" allowEmpty={true}>
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="stateid" reference="states">
                <TextField source="name" />
            </ReferenceField>
            <EditButton />
        </Datagrid>
    </List>
);
