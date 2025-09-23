import ActiveModel from '../models/active.model.js';
import BaseRepository from './base.repository.js';

class ActiveRepository extends BaseRepository {
	static _instance = null;

	static getInstance() {
		if (!ActiveRepository._instance) {
			ActiveRepository._instance = new ActiveRepository();
		}
		return ActiveRepository._instance;
	}

	constructor() {
		super(ActiveModel);
	}

	async findWithReference(query, projection, options, hasCommune, hasCreator) {
		let queryBuilder = this._model.find(query, projection, options);
		if (hasCommune) {
			queryBuilder = queryBuilder.populate('commune');
		}
		if (hasCreator) {
			queryBuilder = queryBuilder.populate('createdBy', 'name email avatar');
		}
		return queryBuilder.exec();
	}

	async findByIdWithReference(id, projection = {}, options = {}, hasCommune, hasCreator) {
		if (!id) throw new Error('ID is required');
		let queryBuilder = this._model.findById(id, projection, options);
		if (hasCommune) {
			queryBuilder = queryBuilder.populate('commune');
		}
		if (hasCreator) {
			queryBuilder = queryBuilder.populate('createdBy', 'name email avatar');
		}
		return queryBuilder.exec();
	}

	async findByStatus(status, projection = {}, options = {}) {
		return this.find({ status }, projection, options);
	}

	async findByCommune(communeId, projection = {}, options = {}) {
		return this.find({ commune: communeId }, projection, options);
	}

	async findByTitle(title, projection = {}, options = {}) {
		return this.find({ title: new RegExp(title, 'i') }, projection, options);
	}

	async findByDateRange(startDate, endDate, projection = {}, options = {}) {
		return this.find(
			{
				startDate: { $gte: startDate },
				endDate: { $lte: endDate },
			},
			projection,
			options
		);
	}

	async addRegisteredUser(activeId, userId) {
		const active = await this._model.findById(activeId).exec();
		if (!active) throw new Error('Không tìm thấy hoạt động');
		if (this.isFull(active)) throw new Error('Hoạt động đã đầy');
		return this._model.findOneAndUpdate({ _id: activeId }, { $addToSet: { registeredUsers: userId } }, { new: true }).exec();
	}

	async removeRegisteredUser(activeId, userId) {
		return this._model.findByIdAndUpdate(activeId, { $pull: { registeredUsers: userId } }, { new: true }).exec();
	}

	isFull(active) {
		return (active.registeredUsers?.length || 0) >= active.maxParticipants;
	}
}

const activeRepository = new ActiveRepository();
export default activeRepository;
