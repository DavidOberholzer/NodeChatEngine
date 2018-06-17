import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Login from '../components/Login';
import store from '../store';

storiesOf('Login', module)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('login', () => <Login />);
