import { withApiCache } from '../api-caching.service.js';
import { httpGet, httpPatch } from '../http-client.js';

export const getMe = () => {
	const cacheKey = 'user_me';
	return withApiCache(cacheKey, httpGet, '/user/me');
};

export const updateProfile = (id, data) => {
	return httpPatch(`/user/${id}`, data);
};
