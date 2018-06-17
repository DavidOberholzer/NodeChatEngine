import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ modifiers, origin, children, ...rest }) => (
    <div
        className={`Message ${modifiers ? modifiers : ''} Message--${
            origin ? origin : 'remote'
        }`}
    >
        {children}
    </div>
);

Message.propTypes = {
    modifiers: PropTypes.string,
    origin: PropTypes.string
};

export default Message;
