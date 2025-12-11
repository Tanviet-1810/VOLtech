import activeRepository from '../repository/active.repository.js';
import { isEmpty } from '../utils/type-check.js';
import { ErrorResult, RepositoryError } from '../error/index.js';
import { isValidObjectId } from 'mongoose';
import userService from './user.service.js';
import { ACTIVE_STATUS } from '../enums/active.js';
import userRepository from '../repository/user.repository.js';

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

	async applyScoreAll(activeId) {
		try {
			if (!activeId) {
				return [ErrorResult(400, 'Thiếu ID hoạt động')];
			}

			const active = await activeRepository.findById(activeId);
			if (!active) {
				return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			}

			switch (active.status) {
				case ACTIVE_STATUS.CANCELLED:
					return [ErrorResult(400, 'Hoạt động đã bị hủy bỏ')];
				case ACTIVE_STATUS.COMPLETED:
					break;
				default:
					return [ErrorResult(400, 'Chỉ có thể tính điểm cho hoạt động đã hoàn thành')];
			}

			const updates = [];
			const patchUpdates = {};

			active.registeredUsers.forEach((ru, idx) => {
				if (!ru.isApplied) {
					updates.push(userRepository.update(ru.user, { $inc: { score: active.points } }));
					patchUpdates[`registeredUsers.${idx}.isApplied`] = true;
				}
			});

			if (updates.length === 0) {
				return [ErrorResult(400, 'Tất cả người dùng đã được tính điểm cho hoạt động này')];
			}

			const applyResults = Array(updates.length).fill(true);

			await Promise.all(
				updates.map((updatePromise, idx) =>
					updatePromise
						.then(res => {
							applyResults[idx] = !!res;
							return res;
						})
						.catch(() => {
							applyResults[idx] = false;
							return null;
						})
				)
			);

			const successfulPatchUpdates = {};
			Object.entries(patchUpdates).forEach(([key], idx) => {
				if (applyResults[idx]) {
					successfulPatchUpdates[key] = true;
				}
			});

			if (Object.keys(successfulPatchUpdates).length > 0) {
				await activeRepository.patchUpdate(activeId, successfulPatchUpdates);
			}

			if (!applyResults.some(Boolean)) {
				return [ErrorResult(400, 'Không có người dùng nào được tính điểm thành công')];
			}

			return [null, true];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async removeScoreAll(activeId) {
		try {
			if (!activeId) {
				return [ErrorResult(400, 'Thiếu ID hoạt động')];
			}

			const active = await activeRepository.findById(activeId);
			if (!active) {
				return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			}

			const updates = [];
			const patchUpdates = {};

			active.registeredUsers.forEach((ru, idx) => {
				if (ru.isApplied) {
					updates.push(userRepository.update(ru.user, { $inc: { score: -active.points } }));
					patchUpdates[`registeredUsers.${idx}.isApplied`] = false;
				}
			});

			if (updates.length === 0) {
				return [ErrorResult(400, 'Không có người dùng nào được tính điểm để xóa')];
			}

			const applyResults = Array(updates.length).fill(true);

			await Promise.all(
				updates.map((updatePromise, idx) =>
					updatePromise
						.then(res => {
							applyResults[idx] = !!res;
							return res;
						})
						.catch(() => {
							applyResults[idx] = false;
							return null;
						})
				)
			);

			const successfulPatchUpdates = {};
			Object.entries(patchUpdates).forEach(([key], idx) => {
				if (applyResults[idx]) {
					successfulPatchUpdates[key] = false;
				}
			});

			if (Object.keys(successfulPatchUpdates).length > 0) {
				await activeRepository.patchUpdate(activeId, successfulPatchUpdates);
			}

			if (!applyResults.some(Boolean)) {
				return [ErrorResult(400, 'Không có người dùng nào được xóa điểm thành công')];
			}

			return [null, true];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async applyScoreByUID(activeId, userId) {
		try {
			if (!activeId || !userId) {
				return [ErrorResult(400, 'Thiếu ID hoạt động hoặc người dùng')];
			}

			const active = await activeRepository.findById(activeId);
			if (!active) {
				return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			}

			switch (active.status) {
				case ACTIVE_STATUS.CANCELLED:
					return [ErrorResult(400, 'Hoạt động đã bị hủy bỏ')];
				case ACTIVE_STATUS.COMPLETED:
					break; // OK to proceed
				default:
					return [ErrorResult(400, 'Chỉ có thể tính điểm cho hoạt động đã hoàn thành')];
			}

			const userIndex = active.registeredUsers.findIndex(
				ru => ru.user?.toString() === userId.toString()
			);
			if (userIndex < 0) {
				return [ErrorResult(400, 'Người dùng chưa đăng ký hoạt động')];
			}

			const registeredUser = active.registeredUsers[userIndex];
			if (registeredUser.isApplied) {
				return [ErrorResult(400, 'Người dùng đã được tính điểm cho hoạt động này')];
			}

			registeredUser.isApplied = true;
			await Promise.all([
				userRepository.update(userId, { $inc: { score: active.points } }),
				activeRepository.patchUpdate(activeId, {
					[`registeredUsers.${userIndex}.isApplied`]: true,
				}),
			]);

			return [null, true];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}


	async removeScoreByUID(activeId, userId) {
		try {
			if (!activeId || !userId) {
				return [ErrorResult(400, 'Thiếu ID hoạt động hoặc người dùng')];
			}

			const active = await activeRepository.findById(activeId);
			if (!active) {
				return [ErrorResult(404, 'Không tìm thấy hoạt động')];
			}

			const userIndex = active.registeredUsers.findIndex(
				ru => ru.user?.toString() === userId.toString()
			);
			if (userIndex < 0) {
				return [ErrorResult(400, 'Người dùng chưa đăng ký hoạt động')];
			}

			const registeredUser = active.registeredUsers[userIndex];
			if (!registeredUser.isApplied) {
				return [ErrorResult(400, 'Người dùng chưa được tính điểm cho hoạt động này')];
			}

			registeredUser.isApplied = false;
			await Promise.all([
				userRepository.update(userId, { $inc: { score: -active.points } }),
				activeRepository.patchUpdate(activeId, {
					[`registeredUsers.${userIndex}.isApplied`]: false,
				}),
			]);

			return [null, true];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}
}

const activeService = new ActiveService();
export default activeService;
