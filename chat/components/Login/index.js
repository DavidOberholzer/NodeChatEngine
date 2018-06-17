import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import { login } from '../../actions/auth';

const mapStateToProps = state => ({
    idToken: state.auth.idToken
});

const mapDispatchToProps = dispatch => ({
    login: idToken => dispatch(login(idToken))
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
        const { login } = this.props;
        if (username.length === 0) {
            this.setState({ username: { value: username.value, error: 'Username required!' } });
            return;
        } else if (password.length === 0) {
            this.setState({ password: { value: password.value, error: 'Password required!' } });
            return;
        }
        const request = new Request('http://localhost:3000/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username: username.value, password: password.value }),
            headers: new Headers({ 'Content-Type': 'application/json' })
        });
        fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                login(data.token);
                this.setState({
                    idToken: data.token,
                    username: { value: '', error: null },
                    password: { value: '', error: null }
                });
            });
    }
    render() {
        const { username, password, idToken } = this.state;
        return idToken ? (
            <Redirect push to="/chat-space" />
        ) : (
            <Card>
                <CardContent component="h1">Login</CardContent>
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
                    <Button size="small" color="primary" onClick={this.handleSubmit}>
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
