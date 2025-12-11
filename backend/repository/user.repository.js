import BaseRepository from './base.repository.js';
import User from '../models/user.model.js';

class UserRepository extends BaseRepository {
	static _instance = null;

	static getInstance() {
		if (!UserRepository._instance) UserRepository._instance = new UserRepository();
		return UserRepository._instance;
	}

	constructor() {
		super(User);
	}

	async findByEmail(email, projection = {}, options = {}) {
		return this.findOne({ email }, projection, options);
	}
}

const userRepository = UserRepository.getInstance();
export default userRepository;
