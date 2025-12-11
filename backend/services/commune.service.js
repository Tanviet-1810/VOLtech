import communeRepository from '../repository/commune.repository.js';
import { isEmpty } from '../utils/type-check.js';
import { ErrorResult, RepositoryError } from '../error/index.js';

class CommuneService {
	async getList(query = {}, projection = {}, options = {}) {
		try {
			const communes = await communeRepository.find(query, projection, options);
			if (!communes || communes.length === 0) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã nào')];
			return [null, communes];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getById(id, projection = {}, options = {}) {
		try {
			if (!id) return [ErrorResult(400, 'Thiếu ID quận/huyện/thị xã')];
			const commune = await communeRepository.findById(id, projection, options);
			if (!commune) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã')];
			return [null, commune];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByCode(code, projection = {}, options = {}) {
		try {
			if (!code) return [ErrorResult(400, 'Thiếu mã quận/huyện/thị xã')];
			const commune = await communeRepository.findByCode(code, projection, options);
			if (!commune) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã')];
			return [null, commune];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByName(name, projection = {}, options = {}) {
		try {
			if (!name) return [ErrorResult(400, 'Thiếu tên quận/huyện/thị xã')];
			const communes = await communeRepository.findByName(name, projection, options);
			if (!communes || communes.length === 0) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã')];
			return [null, communes];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async exists(query = {}) {
		try {
			if (!query) return [ErrorResult(400, 'Thiếu thông tin truy vấn')];
			const exists = await communeRepository.exists(query);
			return [null, exists];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async count(query = {}) {
		try {
			const count = await communeRepository.count(query);
			return [null, count];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async create(data) {
		try {
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu quận/huyện/thị xã')];
			const commune = await communeRepository.create(data);
			return [null, commune];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async update(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID quận/huyện/thị xã')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const commune = await communeRepository.update(id, data, options);
			if (isEmpty(commune)) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã')];
			return [null, commune];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async patchUpdate(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID quận/huyện/thị xã')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const commune = await communeRepository.patchUpdate(id, data, options);
			if (isEmpty(commune)) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã')];
			return [null, commune];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async delete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID quận/huyện/thị xã')];
			const commune = await communeRepository.hardDelete(id);
			if (isEmpty(commune)) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã')];
			return [null, commune];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async softDelete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID quận/huyện/thị xã')];
			const commune = await communeRepository.softDelete(id);
			if (isEmpty(commune)) return [ErrorResult(404, 'Không tìm thấy quận/huyện/thị xã')];
			return [null, commune];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}
}

const provinceService = new CommuneService();
export default provinceService;
