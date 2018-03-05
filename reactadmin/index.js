import React from 'react';
import { render } from 'react-dom';
import { simpleRestClient, Admin, Resource } from 'admin-on-rest';

import { ButtonList } from './lists/buttons';
import { StateList } from './lists/states';
import { WorkflowList } from './lists/workflows';

import { StateCreate } from './creates/state';
import { WorkflowCreate } from './creates/workflow';

import { StateEdit } from './edits/state';
import { WorkflowEdit } from './edits/workflow';

console.log(document.getElementById('Admin'));

document.getElementById('Admin') &&
    render(
        <Admin
            title="Node Chat Engine"
            restClient={simpleRestClient('http://localhost:3000/api/v1')}
        >
            <Resource
                name="workflows"
                list={WorkflowList}
                create={WorkflowCreate}
                edit={WorkflowEdit}
            />
            <Resource
                name="states"
                list={StateList}
                create={StateCreate}
                edit={StateEdit}
            />
            <Resource name="buttons" list={ButtonList} />
        </Admin>,
        document.getElementById('Admin')
    );
