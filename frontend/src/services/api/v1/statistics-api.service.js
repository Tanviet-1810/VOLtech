import { withApiCache } from '../api-caching.service.js';
import { httpGet } from '../http-client.js';

export const getOverallStatistics = () => {
	const key = 'overall_statistics';
	return withApiCache(key, httpGet, '/statistics');
};
