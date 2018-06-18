import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import api from '../../utils/api';
import { login } from '../../actions/auth';
import { chatWorkflowsLoad } from '../../actions/chat';

const mapStateToProps = state => ({
    idToken: state.auth.idToken,
    workflows: state.chat.workflows
});

const mapDispatchToProps = dispatch => ({
    login: idToken => dispatch(login(idToken)),
    chatWorkflowsLoad: workflows => dispatch(chatWorkflowsLoad(workflows))
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idToken: props.idToken,
            username: {
                value: '',
                error: null
            },
            password: {
                value: '',
                error: null
            }
        };
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeUsername(event) {
        this.setState({ username: { value: event.target.value, error: null } });
    }
    handleChangePassword(event) {
        this.setState({ password: { value: event.target.value, error: null } });
    }
    handleSubmit() {
        const { username, password } = this.state;
        const { login, chatWorkflowsLoad } = this.props;
        if (username.length === 0) {
            this.setState({ username: { value: username.value, error: 'Username required!' } });
            return;
        } else if (password.length === 0) {
            this.setState({ password: { value: password.value, error: 'Password required!' } });
            return;
        }
        api.auth(username.value, password.value).then(data => {
            const token = data.token;
            login(token);
            localStorage.setItem('token', token);
            api.workflows(token).then(data => {
                chatWorkflowsLoad(data);
                this.setState({
                    idToken: token,
                    username: { value: '', error: null },
                    password: { value: '', error: null }
                });
            });
        });
    }
    render() {
        const { username, password, idToken } = this.state;
        return idToken ? (
            <Redirect push to="/chat-space" />
        ) : (
            <Card classes={{ root: 'Login Login--card' }}>
                <CardContent component="h1" classes={{ root: 'Login Login--title' }}>
                    Login
                </CardContent>
                <CardContent component="div">
                    <TextField
                        id="username-input"
                        label="Username"
                        type="text"
                        margin="normal"
                        onChange={this.handleChangeUsername}
                        value={username.value}
                        helperText={username.error}
                    />
                </CardContent>
                <CardContent component="div">
                    <TextField
                        id="password-input"
                        label="Password"
                        type="password"
                        margin="normal"
                        onChange={this.handleChangePassword}
                        value={password.value}
                        helperText={password.error}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        data-cy="login"
                    >
                        Login
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
