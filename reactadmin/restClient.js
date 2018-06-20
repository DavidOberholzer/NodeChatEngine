import { fetchUtils, simpleRestClient } from 'admin-on-rest';

import constants from '../constants';

const env = process.env.NODE_ENV || 'dev';
const url = constants.urls[env];

const httpClient = (url, options = {}) => {
	if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
}

export default simpleRestClient(`${url}/api/v1`, httpClient);