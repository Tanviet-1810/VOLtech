class BaseRepository {
	constructor(model) {
		if (new.target === BaseRepository) {
			throw new TypeError('Cannot construct BaseRepository instances directly');
		}
		this._model = model;
	}

	async find(query = {}, projection = {}, options = {}) {
		let queryBuilder = this._model.find(query, projection, options);

		return queryBuilder.exec();
	}

	async findOne(query = {}, projection = {}, options = {}) {
		return this._model.findOne(query, projection, options).exec();
	}

	async findById(id, projection = {}, options = {}) {
		if (!id) throw new Error('ID is required');
		return this._model.findById(id, projection, options).exec();
	}

	async exists(query = {}) {
		const result = await this._model.exists(query).exec();
		return !!result;
	}

	async count(query = {}) {
		return this._model.countDocuments(query).exec();
	}

	async create(data) {
		return this._model.create(data);
	}

	async update(id, data, options = {}) {
		return this._model.findByIdAndUpdate(id, data, { new: true, ...options }).exec();
	}

	async patchUpdate(id, data, options = {}) {
		return this._model.findByIdAndUpdate(id, { $set: data }, { new: true, ...options }).exec();
	}

	async hardDelete(id) {
		return this._model.findByIdAndDelete(id).exec();
	}

	async softDelete(id) {
		return this._model.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
	}
}

export default BaseRepository;
