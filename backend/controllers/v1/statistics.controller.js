import { statisticsService } from '../../services/statistics.service.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';

export const statisticsController = {
	getOverallStatistics: async (req, res, next) => {
		try {
			const statistics = await statisticsService.getOverallStatistics();
            return sendJsonResponse(res, 200, statistics);
		} catch (error) {
			next(error);
		}
	},
};
