import { statisticsRepository } from '../repository/statistics.repository.js';

export const statisticsService = {
	getOverallStatistics: async () => {
		const [totalUsers, totalActivities] = await Promise.all([
			statisticsRepository.countTotalUsers(),
			statisticsRepository.countTotalActivities(),
		]);

		return {
			totalUsers,
			totalActivities,
		};
	},
};
