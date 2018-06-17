import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Message from '../components/Message';

storiesOf('Message', module)
    .add('user_message', () => (
        <Message origin="user">I am a user and this is my message</Message>
    ))
    .add('bot_message', () => (
        <Message origin="remote">I am a bot and this is my will.</Message>
    ))
    .add('old_message', () => (
        <Message modifiers="Message--old show">Old message here</Message>
    ));
