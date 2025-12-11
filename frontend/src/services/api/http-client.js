import APP_CONFIG from '../../../config.js';
import LocalStorageService, { LOCAL_STORAGE_KEYS } from '../storage/local-storage.service.js';

const defaultHeaders = {
	'Content-Type': 'application/json',
};

const request = (method, path = '', body = null, headers = {}) => {
	const url = APP_CONFIG.api.getFullPath(path);
	const token = LocalStorageService.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	const options = {
		method,
		headers: { ...defaultHeaders, ...headers },
		...(body ? { body: JSON.stringify(body) } : {}),
	};

	return fetch(url, options);
};

export const httpGet = (path, headers = {}) => request('GET', path, null, headers);
export const httpPost = (path, body, headers = {}) => request('POST', path, body, headers);
export const httpPut = (path, body, headers = {}) => request('PUT', path, body, headers);
export const httpPatch = (path, body, headers = {}) => request('PATCH', path, body, headers);
export const httpDelete = (path, headers = {}) => request('DELETE', path, null, headers);
