import ProvinceModel from '../models/province.model.js';
import BaseRepository from './base.repository.js';

class ProvinceRepository extends BaseRepository {
	static _instance = null;

	static getInstance() {
		if (!ProvinceRepository._instance) {
			ProvinceRepository._instance = new ProvinceRepository();
		}

		return ProvinceRepository._instance;
	}

	constructor() {
		super(ProvinceModel);
	}

	async findByCode(code, projection = {}, options = {}) {
		return this.findOne({ code: code.toUpperCase() }, projection, options);
	}

	async findByName(name, projection = {}, options = {}) {
		return this.find({ name: new RegExp('^' + name, 'i') }, projection, options);
	}
}

const provinceRepository = new ProvinceRepository();
export default provinceRepository;
