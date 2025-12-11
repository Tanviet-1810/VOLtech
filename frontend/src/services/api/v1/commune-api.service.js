import { withApiCache } from '../api-caching.service.js';
import { httpGet } from '../http-client.js';

export const getCommunes = ({ page, limit, name, code, province }) => {
	const query = {};

	if (page) query.page = page;
	if (limit) query.limit = limit;
	if (name) query.name = name;
	if (code) query.code = code;
	if (province) query.province = province;

	const key = `communes_${JSON.stringify(query)}`;
	const queryString = Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : '';
	return withApiCache(key, httpGet, `/commune${queryString}`);
};

export const getCommuneById = (id) => {
	const cacheKey = `commune_${id}`;
	return withApiCache(cacheKey, httpGet, `/commune/${id}`);
};
