export default {
    auth: (username, password) => {
        const request = new Request(
            `${window.location.href.split('/', 3).join('/')}/authenticate`,
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: new Headers({ 'Content-Type': 'application/json' })
            }
        );
        return fetch(request).then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    },
    workflows: idToken => {
        const request = new Request(
            `${window.location.href.split('/', 3).join('/')}/api/v1/workflow`,
            {
                method: 'GET',
                headers: new Headers({ Authorization: `Bearer ${idToken}` })
            }
        );
        return fetch(request).then(response => {
            return response.json();
        });
    }
};
