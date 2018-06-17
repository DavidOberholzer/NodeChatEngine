import { AUTH_LOGIN, AUTH_LOGOUT } from '../actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case AUTH_LOGIN:
            return {
                idToken: action.payload
            };
        case AUTH_LOGOUT:
            return {};
        default:
            return state;
    }
};
