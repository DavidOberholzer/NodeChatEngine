import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MessageContainer from '../components/MessageContainer';

const buttons = [
    {
        text: 'Button 1',
        goto: 1
    },
    {
        text: 'Button 2',
        goto: 2
    },
    {
        text: 'A Third button',
        goto: 4
    }
];

storiesOf('MessageContainer', module).add('Remote Message With Buttons', () => (
    <MessageContainer
        origin="remote"
        text="Hello, here are buttons"
        buttons={buttons}
    />
));
