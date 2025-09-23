import activeRepository from '../repository/active.repository.js';
import { isEmpty } from '../utils/type-check.js';
import { ErrorResult, RepositoryError } from '../error/index.js';
import { isValidObjectId } from 'mongoose';
import userService from './user.service.js';

class ActiveService {
	async getList(query = {}, projection = {}, options = {}) {
		try {
			const actives = await activeRepository.findWithReference(query, projection, options, true, true);
			if (!actives || actives.length === 0) return [ErrorResult(404, 'Không tìm thấy hoạt động nào')];
			return [null, actives];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getById(id, projection = {}, options = {}, hasCommune = true, hasCreator = true) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID hoạt động')];
			const active = await activeRepository.findByIdWithReference(id, projection, options, hasCommune, hasCreator);
			if (!active) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByStatus(status, projection = {}, options = {}) {
		try {
			if (isEmpty(status)) return [ErrorResult(400, 'Thiếu trạng thái hoạt động')];
			const actives = await activeRepository.findByStatus(status, projection, options);
			if (!actives || actives.length === 0) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, actives];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByCommune(communeId, projection = {}, options = {}) {
		try {
			if (isEmpty(communeId)) return [ErrorResult(400, 'Thiếu ID xã/phường/thị trấn')];
			const actives = await activeRepository.findByCommune(communeId, projection, options);
			if (!actives || actives.length === 0) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, actives];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByTitle(title, projection = {}, options = {}) {
		try {
			if (isEmpty(title)) return [ErrorResult(400, 'Thiếu tiêu đề hoạt động')];
			const actives = await activeRepository.findByTitle(title, projection, options);
			if (!actives || actives.length === 0) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, actives];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getByDateRange(startDate, endDate, projection = {}, options = {}) {
		try {
			if (isEmpty(startDate) || isEmpty(endDate)) return [ErrorResult(400, 'Thiếu khoảng thời gian')];
			const actives = await activeRepository.findByDateRange(startDate, endDate, projection, options);
			if (!actives || actives.length === 0) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, actives];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async exists(query = {}) {
		try {
			if (!query) return [ErrorResult(400, 'Thiếu thông tin truy vấn')];
			const exists = await activeRepository.exists(query);
			return [null, exists];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async count(query = {}) {
		try {
			const count = await activeRepository.count(query);
			return [null, count];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async create(creator, data) {
		try {
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu hoạt động')];
			if (isEmpty(creator) || !isValidObjectId(creator)) return [ErrorResult(400, 'Cần ID người tạo hợp lệ')];

			const [errCreator] = await userService.getById(creator);
			if (errCreator) return [errCreator];

			const active = await activeRepository.create({ ...data, createdBy: creator });
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async update(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID hoạt động')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const active = await activeRepository.update(id, data, options);
			if (isEmpty(active)) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async patchUpdate(id, data, options = {}) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID hoạt động')];
			if (isEmpty(data)) return [ErrorResult(400, 'Thiếu dữ liệu cập nhật')];
			const active = await activeRepository.patchUpdate(id, data, options);
			if (isEmpty(active)) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async delete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID hoạt động')];
			const active = await activeRepository.hardDelete(id);
			if (isEmpty(active)) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async softDelete(id) {
		try {
			if (isEmpty(id)) return [ErrorResult(400, 'Thiếu ID hoạt động')];
			const active = await activeRepository.softDelete(id);
			if (isEmpty(active)) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async addRegisteredUser(activeId, userId) {
		try {
			if (isEmpty(activeId) || isEmpty(userId)) return [ErrorResult(400, 'Thiếu ID hoạt động hoặc người dùng')];
			const active = await activeRepository.addRegisteredUser(activeId, userId);
			if (isEmpty(active)) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async removeRegisteredUser(activeId, userId) {
		try {
			if (isEmpty(activeId) || isEmpty(userId)) return [ErrorResult(400, 'Thiếu ID hoạt động hoặc người dùng')];
			const active = await activeRepository.removeRegisteredUser(activeId, userId);
			if (isEmpty(active)) return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			return [null, active];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}
}

const activeService = new ActiveService();
export default activeService;
