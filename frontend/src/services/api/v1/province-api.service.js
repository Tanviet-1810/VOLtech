import { withApiCache } from '../api-caching.service.js';
import { httpGet } from '../http-client.js';

export const getProvinces = ({ page, limit, name, code }) => {
	const query = {};

	if (page) query.page = page;
	if (limit) query.limit = limit;
	if (name) query.name = name;
	if (code) query.code = code;

	const key = `provinces_${JSON.stringify(query)}`;
	const queryString = Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : '';
	return withApiCache(key, httpGet, `/province${queryString}`);
};

export const getProvinceById = (id) => {
	const cacheKey = `province_${id}`;
	return withApiCache(cacheKey, httpGet, `/province/${id}`);
};
