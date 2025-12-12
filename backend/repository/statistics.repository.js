import UserModel from '../models/user.model.js';
import ActiveModel from '../models/active.model.js';

export const statisticsRepository = {
	countTotalUsers: async () => {
		return await UserModel.countDocuments();
	},

	countTotalActivities: async () => {
		return await ActiveModel.countDocuments();
	},
};
