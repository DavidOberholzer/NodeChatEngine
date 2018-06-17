import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

import api from '../../utils/api';
import store from '../../store';
import ChatContainer from '../ChatContainer';
import LocalButton from '../Button';
import { chatChangeWorkflow, chatWorkflowsLoad } from '../../actions/chat';
import WebSocket from '../../utils/client';
import { messageClearAll } from '../../actions/messages';

const mapDispatchToProps = dispatch => ({
    chatWorkflowsLoad: workflows => dispatch(chatWorkflowsLoad(workflows)),
    chatChangeWorkflow: workflowID => dispatch(chatChangeWorkflow(workflowID)),
    messageClearAll: () => dispatch(messageClearAll())
});

const mapStateToProps = state => ({
    idToken: state.auth.idToken,
    workflows: state.chat.workflows,
    workflowID: state.chat.workflowID
});

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorised: !!props.idToken,
            workflows: props.workflows,
            anchorEl: null,
            selection: props.workflowID
        };
        this.getWorkflows = this.getWorkflows.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    getWorkflows() {
        api.workflows(this.props.idToken)
            .then(data => {
                this.props.chatWorkflowsLoad(data);
                this.setState({ workflows: data });
            })
            .catch(error => {
                localStorage.removeItem('token');
                this.setState({ authorised: false });
                console.error(error);
            });
    }
    handleBack(event) {
        WebSocket().send(JSON.stringify({ text: '!reset' }));
        this.props.messageClearAll();
        this.props.chatChangeWorkflow(null);
        this.setState({ selection: null });
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
        if (!workflows) {
            this.getWorkflows();
        }
        return authorised ? (
            !selection ? (
                workflows ? (
                    <div className="Chat Chat--dropdown">
                        <Button
                            aria-owns={anchorEl ? 'simple-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            variant="contained"
                            color="primary"
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
                <div>
                    <LocalButton modifiers="Button--back" customOnClick={this.handleBack}>
                        Back
                    </LocalButton>
                    <ChatContainer />
                </div>
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
