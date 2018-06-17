import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

import store from '../../store';
import ChatContainer from '../ChatContainer';
import { chatChangeWorkflow } from '../../actions/chat';
import WebSocket from '../../utils/client';

const mapDispatchToProps = dispatch => ({
    chatChangeWorkflow: workflowID => dispatch(chatChangeWorkflow(workflowID))
});

const mapStateToProps = state => ({
    idToken: state.auth.idToken
});

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorised: !!props.idToken,
            workflows: null,
            anchorEl: null,
            selection: null
        };
        this.getWorkflows = this.getWorkflows.bind(this);
        this.getWorkflows();
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    getWorkflows() {
        const request = new Request('http://localhost:3000/api/v1/workflow', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.props.idToken}`
            }
        });
        fetch(request)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                this.setState({ workflows: data });
            })
            .catch(error => {
                console.error(error);
            });
    }
    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }
    handleClose(value) {
        this.props.chatChangeWorkflow(value);
        this.setState({ anchorEl: null, selection: value });
    }
    render() {
        const { authorised, workflows, anchorEl, selection } = this.state;
        return authorised ? (
            !selection ? (
                workflows ? (
                    <div>
                        <Button
                            aria-owns={anchorEl ? 'simple-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                        >
                            Choose Workflow
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => this.handleClose(null)}
                        >
                            {workflows.map(workflow => (
                                <MenuItem
                                    key={workflow.id}
                                    onClick={() => this.handleClose(workflow.id)}
                                >
                                    {workflow.name}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                ) : (
                    <CircularProgress style={{ color: purple[500] }} thickness={7} />
                )
            ) : (
                <ChatContainer />
            )
        ) : (
            <Redirect push to="/" />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
