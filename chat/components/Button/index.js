import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import WebSocket from '../../utils/client';
import { messageAdd } from '../../actions/messages';

const mapDispatchToProps = dispatch => ({
    onClick: message => dispatch(messageAdd(message))
});

class Button extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const { button, onClick } = this.props;
        WebSocket().send(JSON.stringify(button));
        onClick({ ...button, origin: 'user' });
    }

    render() {
        const { modifiers, type, children, customOnClick } = this.props;
        return (
            <button
                className={`Button ${modifiers ? modifiers : ''}`}
                type={type}
                onClick={customOnClick ? customOnClick : this.handleClick}
            >
                {children}
            </button>
        );
    }
}
Button.propTypes = {
    modifiers: PropTypes.string,
    children: PropTypes.node,
    customOnClick: PropTypes.func
};

export default connect(
    null,
    mapDispatchToProps
)(Button);
