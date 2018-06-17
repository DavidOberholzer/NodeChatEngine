import React, { Component } from 'react';
import { connect } from 'react-redux';

import WebSocket from '../../utils/client';
import { messageAdd } from '../../actions/messages';

const mapStateToProps = state => ({ messages: state.messages.messages });

const mapDispatchToProps = dispatch => ({
    onSubmit: message => dispatch(messageAdd(message))
});

class InputBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleOnKeyDown(event) {
        const { onSubmit, messages } = this.props;

        if (event.which === 13) {
            const lastMessage = messages[messages.length - 1];
            const message = {
                text: this.state.value,
                input: lastMessage.input,
                goto: lastMessage.auto
            };
            WebSocket().send(JSON.stringify(message));
            onSubmit({
                ...message,
                origin: 'user'
            });
        }
    }

    render() {
        return (
            <div className="InputBar">
                <input
                    className="InputBar--input"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onKeyPress={this.handleOnKeyDown}
                    placeholder="Type answer:"
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputBar);
