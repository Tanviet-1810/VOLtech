import { withApiCache } from '../api-caching.service.js';
import { httpDelete, httpGet, httpPatch, httpPost } from '../http-client.js';

export const getList = ({ title, status, commune, createdBy, sortBy, sortOrder, joined, isCreator, page, limit }) => {
	const query = {};

	if (title) query.title = title;
	if (status) query.status = status;
	if (commune) query.commune = commune;
	if (createdBy) query.createdBy = createdBy;
	if (sortBy) {
		query.sortBy = sortBy;
		if (sortOrder) query.sortOrder = sortOrder;
	}
	if (joined !== undefined) query.joined = joined;
	if (isCreator !== undefined) query.isCreator = isCreator;
	if (page) query.page = page;
	if (limit) query.limit = limit;

	const key = `active_list_${JSON.stringify(query)}`;
	const queryString = Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : '';
	return withApiCache(key, httpGet, `/active${queryString}`);
};

export const getDetail = (id) => {
	const key = `active_detail_${id}`;
	return withApiCache(key, httpGet, `/active/${id}`);
};

export const createActive = (data) => {
	return httpPost('/active', data);
};

export const updateActive = (id, data) => {
	return httpPatch(`/active/${id}`, data);
};

export const deleteActive = (id) => {
	return httpDelete(`/active/${id}`);
};

export const joinActive = (id) => {
	return httpPost(`/active/${id}/participants`);
};

export const leaveActive = (id) => {
	return httpDelete(`/active/${id}/participants`);
};
