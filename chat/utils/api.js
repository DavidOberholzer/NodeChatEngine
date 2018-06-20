import constants from '../../constants';

const env = process.env.NODE_ENV || 'dev';
const url = constants.urls[env];
console.log(url);

export default {
    auth: (username, password) => {
        const request = new Request(`${url}/authenticate`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' })
        });
        return fetch(request).then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    },
    workflows: idToken => {
        const request = new Request(`${url}/api/v1/workflow`, {
            method: 'GET',
            headers: new Headers({ Authorization: `Bearer ${idToken}` })
        });
        return fetch(request).then(response => {
            return response.json();
        });
    }
};
