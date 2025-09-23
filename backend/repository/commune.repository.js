import CommuneModel from '../models/commune.model.js';
import BaseRepository from './base.repository.js';

class CommuneRepository extends BaseRepository {
	static _instance = null;

	static getInstance() {
		if (!CommuneRepository._instance) {
			CommuneRepository._instance = new CommuneRepository();
		}

		return CommuneRepository._instance;
	}

	constructor() {
		super(CommuneModel);
	}

	async findByProvince(provinceId, projection = {}, options = {}) {
		return this.findOne({ province: provinceId }, projection, options);
	}

	async findByCode(code, projection = {}, options = {}) {
		return this.findOne({ code: code.toUpperCase() }, projection, options);
	}

	async findByName(name, projection = {}, options = {}) {
		return this.find({ name: new RegExp('^' + name, 'i') }, projection, options);
	}
}

const communeRepository = new CommuneRepository();
export default communeRepository;
