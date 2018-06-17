import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Chat from './components/Chat';
import Login from './components/Login';

const App = () => (
    <Router>
        <div>
            <Route path="/" component={Login} />
            <Route path="/chat-space" component={Chat} />
        </div>
    </Router>
);

export default App;
