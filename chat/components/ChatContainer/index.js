import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { messageAdd } from '../../actions/messages';
import InputBar from '../InputBar';
import MessageContainer from '../MessageContainer';
import { MESSAGE_ADD } from '../../actionTypes';
import { randomId } from '../../utils/generation';
import WebSocket from '../../utils/client';

const mapStateToProps = state => ({
    workflowID: state.chat.workflowID,
    messages: state.messages.messages
});

class ChatContainer extends React.Component {
    constructor(props) {
        super(props);
        if (!props.styleDebugMode) {
            WebSocket().send(JSON.stringify({ workflowID: this.props.workflowID }));
        }
    }

    componentDidUpdate() {
        this._last &&
            this._last.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'end'
            });
    }

    render() {
        const { messages } = this.props;
        let showInput = false;
        if (messages.length > 0) {
            showInput = !!messages[messages.length - 1].input;
        }
        return (
            <div className="ChatContainer">
                <ReactCSSTransitionGroup
                    transitionName="message"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={0}
                >
                    {messages.length > 0 ? (
                        messages.map((message, index) => {
                            const id = message.timeAdded;
                            const lastMessage = index === messages.length - 1;
                            return (
                                <MessageContainer
                                    key={id}
                                    origin={message.origin}
                                    text={message.text}
                                    buttons={message.buttons}
                                    lastMessage={lastMessage}
                                />
                            );
                        })
                    ) : (
                        <span>No messages received, yet!</span>
                    )}
                </ReactCSSTransitionGroup>
                {showInput && <InputBar />}
            </div>
        );
    }
}

ChatContainer.propTypes = {
    messages: PropTypes.array,
    styleDebugMode: PropTypes.bool
};

ChatContainer.defaultProps = {
    styleDebugMode: false
};

export default connect(
    mapStateToProps,
    null
)(ChatContainer);
