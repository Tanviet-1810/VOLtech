import userRepository from '../repository/user.repository.js';
import { isEmpty } from '../utils/type-check.js';
import { ErrorResult, RepositoryError } from '../error/index.js';

class UserService {
	async getList(query = {}, projection = {}, options = {}) {
		try {
			const users = await userRepository.find(query, projection, options);
			if (isEmpty(users)) return [ErrorResult(404, 'Không tìm thấy bất kỳ người dùng nào')];
			return [null, users];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getById(id, projection = {}, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID người dùng')];
			const user = await userRepository.findById(id, projection, options);
			if (isEmpty(user)) return [ErrorResult(404, 'Không tìm thấy người dùng')];
			return [null, user];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByEmail(email, projection = {}, options = {}) {
		try {
			if (isEmpty(email)) return [ErrorResult(400, 'Thiếu email người dùng')];
			const user = await userRepository.findByEmail(email, projection, options);
			if (isEmpty(user)) return [ErrorResult(404, 'Không tìm thấy người dùng')];
			return [null, user];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async exists(query = {}) {
		try {
			if (isEmpty(query)) return [ErrorResult(400, 'Thiếu thông tin truy vấn')];
			const exists = await userRepository.exists(query);
			return [null, exists];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async count(query = {}) {
		try {
			const count = await userRepository.count(query);
			return [null, count];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async create(data) {
		try {
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu người dùng')];
			const user = await userRepository.create(data);
			return [null, user];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async update(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID người dùng')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const user = await userRepository.update(id, data, options);
			if (isEmpty(user)) return [ErrorResult(404, 'Không tìm thấy người dùng')];
			return [null, user];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async patchUpdate(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID người dùng')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const user = await userRepository.patchUpdate(id, data, options);
			if (isEmpty(user)) return [ErrorResult(404, 'Không tìm thấy người dùng')];
			return [null, user];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async delete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID người dùng')];
			const user = await userRepository.hardDelete(id);
			return [null, user];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async softDelete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID người dùng')];
			const user = await userRepository.softDelete(id);
			if (isEmpty(user)) return [ErrorResult(404, 'Không tìm thấy người dùng')];
			return [null, user];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}
}

const userService = new UserService();
export default userService;
