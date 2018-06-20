import { fetchUtils, simpleRestClient } from 'admin-on-rest';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

export default simpleRestClient(
    `${window.location.href.split('/', 3).join('/')}/api/v1`,
    httpClient
);
