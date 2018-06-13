import React from 'react';

import {
    Edit,
    SimpleForm,
    BooleanField,
    BooleanInput,
    DisabledInput,
    LongTextInput,
    TextInput,
    ReferenceManyField,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    Datagrid,
    TextField,
    DateField,
    EditButton
} from 'admin-on-rest';

export const StateEdit = props => (
    <Edit title="Edit State" {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <DisabledInput source="createdat" label="Created" />
            <TextInput source="name" />
            <LongTextInput source="text" />
            <TextInput source="input" />
            <BooleanInput source="startstate" label="Is Start State" />
            <ReferenceInput source="auto" label="Auto Goto State" reference="state" allowEmpty>
                <SelectInput source="id" optionText="name" />
            </ReferenceInput>
            <ReferenceManyField label="Buttons" reference="button" target="stateid">
                <Datagrid>
                    <TextField source="id" />
                    <DateField source="createdat" label="Created" />
                    <TextField source="text" />
                    <ReferenceField source="goto" reference="state" allowEmpty>
                        <TextField source="name" />
                    </ReferenceField>
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);
