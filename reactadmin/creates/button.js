import React from 'react';

import {
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    SelectInput
} from 'admin-on-rest';

const validationCreateButton = values => {
    const errors = {};
    if (!values.id) {
        errors.id = ['An ID is required.'];
    } else if (isNaN(values.id)) {
        errors.id = ['An ID must be an integer.'];
    }
    if (!values.name) {
        errors.name = ['A name is required.'];
    }
    if (!values.stateid) {
        errors.stateid = ['This button must belong to a state'];
    }
    return errors;
};

export const ButtonCreate = props => (
    <Create title="Create New Button" {...props}>
        <SimpleForm validate={validationCreateButton}>
            <TextInput source="id" />
            <TextInput source="text" />
            <ReferenceInput
                source="goto"
                label="Goto State"
                reference="states"
                allowEmpty
            >
                <SelectInput source="id" optionText="name" />
            </ReferenceInput>
            <ReferenceInput
                source="stateid"
                label="State"
                reference="states"
                allowEmpty
            >
                <SelectInput source="id" optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);
