import { withApiCache } from '../api-caching.service.js';
import { httpGet } from '../http-client.js';

export const getUserRankings = (params = {}) => {
	const { page = 1, limit = 10, sortOrder = 'desc' } = params;
	const query = new URLSearchParams({
		page,
		limit,
		sortBy: 'score',
		sortOrder,
	}).toString();

	const cacheKey = `user_rankings_${page}_${limit}_${sortOrder}`;
	// call public rankings endpoint so frontend can display leaderboard without auth
	return withApiCache(cacheKey, httpGet, `/user/rankings?${query}`);
};
