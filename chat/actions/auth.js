import { AUTH_LOGIN, AUTH_LOGOUT } from '../actionTypes';

export const login = idToken => ({
    type: AUTH_LOGIN,
    payload: idToken
});

export const logout = () => ({
    type: AUTH_LOGOUT
});
