import provinceRepository from '../repository/province.repository.js';
import { isEmpty } from '../utils/type-check.js';
import { ErrorResult, RepositoryError } from '../error/index.js';

class ProvinceService {
	async getList(query = {}, projection = {}, options = {}) {
		try {
			const provinces = await provinceRepository.find(query, projection, options);
			if (!provinces || provinces.length === 0) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành nào')];
			return [null, provinces];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getById(id, projection = {}, options = {}) {
		try {
			if (!id) return [ErrorResult(400, 'Thiếu ID tỉnh/thành')];
			const province = await provinceRepository.findById(id, projection, options);
			if (!province) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành')];
			return [null, province];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByCode(code, projection = {}, options = {}) {
		try {
			if (!code) return [ErrorResult(400, 'Thiếu mã tỉnh/thành')];
			const province = await provinceRepository.findByCode(code, projection, options);
			if (!province) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành')];
			return [null, province];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByName(name, projection = {}, options = {}) {
		try {
			if (!name) return [ErrorResult(400, 'Thiếu tên tỉnh/thành')];
			const provinces = await provinceRepository.findByName(name, projection, options);
			if (!provinces || provinces.length === 0) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành')];
			return [null, provinces];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async exists(query = {}) {
		try {
			if (!query) return [ErrorResult(400, 'Thiếu thông tin truy vấn')];
			const exists = await provinceRepository.exists(query);
			return [null, exists];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async count(query = {}) {
		try {
			const count = await provinceRepository.count(query);
			return [null, count];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async create(data) {
		try {
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu tỉnh/thành')];
			const province = await provinceRepository.create(data);
			return [null, province];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async update(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID tỉnh/thành')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const province = await provinceRepository.update(id, data, options);
			if (isEmpty(province)) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành')];
			return [null, province];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async patchUpdate(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID tỉnh/thành')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const province = await provinceRepository.patchUpdate(id, data, options);
			if (isEmpty(province)) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành')];
			return [null, province];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async delete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID tỉnh/thành')];
			const province = await provinceRepository.hardDelete(id);
			if (isEmpty(province)) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành')];
			return [null, province];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async softDelete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID tỉnh/thành')];
			const province = await provinceRepository.softDelete(id);
			if (isEmpty(province)) return [ErrorResult(404, 'Không tìm thấy tỉnh/thành')];
			return [null, province];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}
}

const provinceService = new ProvinceService();
export default provinceService;
