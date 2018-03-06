import React from 'react';
import { render } from 'react-dom';
import { simpleRestClient, Admin, Resource } from 'admin-on-rest';

import { ButtonList } from './lists/buttons';
import { StateList } from './lists/states';
import { WorkflowList } from './lists/workflows';

import { ButtonCreate } from './creates/button';
import { StateCreate } from './creates/state';
import { WorkflowCreate } from './creates/workflow';

import { ButtonEdit } from './edits/button';
import { StateEdit } from './edits/state';
import { WorkflowEdit } from './edits/workflow';
import { Delete } from 'admin-on-rest/lib/mui';

console.log('Admin Bundle JS Imported and running');

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
                remove={Delete}
            />
            <Resource
                name="states"
                list={StateList}
                create={StateCreate}
                edit={StateEdit}
                remove={Delete}
            />
            <Resource
                name="buttons"
                list={ButtonList}
                create={ButtonCreate}
                edit={ButtonEdit}
                remove={Delete}
            />
        </Admin>,
        document.getElementById('Admin')
    );
