import React from 'react';

import {
    Edit,
    SimpleForm,
    DisabledInput,
    TextInput,
    ReferenceInput,
    SelectInput
} from 'admin-on-rest';

export const ButtonEdit = props => (
    <Edit title="Edit Button" {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <DisabledInput source="createdat" label="Created" />
            <TextInput source="text" />
            <ReferenceInput source="goto" label="Goto State" reference="state" allowEmpty>
                <SelectInput source="id" optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);
