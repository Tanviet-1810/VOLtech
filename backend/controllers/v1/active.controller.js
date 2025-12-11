import activeService from '../../services/active.service.js';
import { isEmpty } from '../../utils/type-check.js';
import { generatePaginateOptions, mapOrderSort } from '../../utils/index.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';
import { isValidObjectId } from 'mongoose';
import { ACTIVE_STATUS } from '../../enums/active.js';

// GET /active
export async function getList(req, res) {
	try {
		const { page, limit, title, status, commune, createdBy, sortBy, sortOrder, joined, isCreator } = req.query;
		const options = generatePaginateOptions(page, limit);

		// Build query object
		const query = {};
		if (!isEmpty(title)) query.title = { $regex: `${title}`, $options: 'i' };
		if (!isEmpty(status)) query.status = status;
		if (!isEmpty(commune) && isValidObjectId(commune)) query.commune = commune;
		if (!isEmpty(createdBy) && isValidObjectId(createdBy)) query.createdBy = createdBy;
		if (!isEmpty(joined) && joined == 'true') {
			// registeredUsers is an array of subdocs { user: ObjectId, isApplied }
			// we must query by the nested field 'registeredUsers.user' to match documents
			if (req.user) {
				query['registeredUsers.user'] = req.user.uid;
			} else {
				// no user attached -> ensure query returns no results
				query['registeredUsers.user'] = null;
			}
		}
		if (!isEmpty(isCreator) && isCreator == 'true') query.createdBy = req.user ? req.user.uid : null;

		// Add sorting
		if (!isEmpty(sortBy)) {
			options.sort = { [sortBy]: mapOrderSort(sortOrder) };
		}

		const [err, actives, errPaginate, activesPaginate] = await Promise.all([activeService.getList(query, {}, options), activeService.count(query)]).then(([listResult, countResult]) => [...listResult, ...countResult]);

		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		const paginate = {
			totalItems: errPaginate ? 0 : activesPaginate,
			currentPage: options.page,
			totalPages: errPaginate ? 1 : Math.ceil(activesPaginate / options.limit),
			limit: options.limit,
		};

		return sendJsonResponse(res, 200, { items: actives, paginate });
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// POST /active
export async function create(req, res) {
	try {
		const [err, active] = await activeService.create(req.user.uid, req.body);
		return handleServiceResponse(res, err, active, 201);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// GET /active/:id
export async function getById(req, res) {
	try {
		const { id } = req.params;
		if (isEmpty(id)) return sendErrorResponse(res, 400, 'Thiếu id');

		const [err, active] = await activeService.getById(id);

		// lazy update
		if (active.status !== ACTIVE_STATUS.COMPLETED && active.status !== ACTIVE_STATUS.CLOSED && active.status !== ACTIVE_STATUS.CANCELLED) {
			const now = new Date();
			if (active.endDate < now) {
				active.status = ACTIVE_STATUS.COMPLETED;
				await active.save();

				const [err] = await activeService.applyScoreAll(id);
				if (err) console.error('Lỗi khi áp điểm tự động cho tất cả người tham gia:', err);

			}
		}
		
		return handleServiceResponse(res, err, active);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// PATCH /active/:id
export async function update(req, res) {
	try {
		const { id } = req.params;
		const {
			body: data,
			user: { uid: userId, role: userRole },
		} = req;

		if (isEmpty(id)) return sendErrorResponse(res, 400, 'Thiếu id');
		if (isEmpty(data)) return sendErrorResponse(res, 400, 'Thiếu dữ liệu cập nhật');

		const [errGet, active] = await activeService.getById(id);
		if (errGet) return sendErrorResponse(res, errGet.code || 404, errGet.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		if (!checkAuthorization(active, userId, userRole)) {
			return sendErrorResponse(res, 403, 'Bạn không có quyền cập nhật hoạt động này');
		}

		const [errUpdate, updatedActive] = await activeService.patchUpdate(id, data);
		return handleServiceResponse(res, errUpdate, updatedActive);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// DELETE /active/:id
export async function remove(req, res) {
	try {
		const { id } = req.params;
		const { uid: userId, role: userRole } = req.user;

		if (isEmpty(id)) return sendErrorResponse(res, 400, 'Thiếu id');

		// Check if active exists and user has permission
		const [errGet, active] = await activeService.getById(id);
		if (errGet) return sendErrorResponse(res, errGet.code || 404, errGet.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		if (!checkAuthorization(active, userId, userRole)) {
			return sendErrorResponse(res, 403, 'Bạn không có quyền xoá hoạt động này');
		}

		const [err, deletedActive] = await activeService.delete(id);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!deletedActive) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		return sendJsonResponse(res, 200, 'Xoá hoạt động thành công');
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// POST /active/:id/participants
export async function join(req, res) {
	try {
		const { id } = req.params;
		if (isEmpty(id)) return sendErrorResponse(res, 400, 'Thiếu id');

		const [err, active] = await activeService.addRegisteredUser(id, req.user.uid);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		return sendJsonResponse(res, 200, 'Tham gia hoạt động thành công');
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// POST /active/:id/score/:uid
export async function applyScoreByUID(req, res) {
	try {
		// id: activity id, uid: user id để áp điểm
		const { id, uid } = req.params;
		if (isEmpty(id)) return sendErrorResponse(res, 400, 'Thiếu id');
		if (isEmpty(uid)) return sendErrorResponse(res, 400, 'Thiếu uid');

		const { uid: applierId, role: applierRole } = req.user;
		const [errGet, active] = await activeService.getById(id);
		if (errGet) return sendErrorResponse(res, errGet.code || 404, errGet.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		if (!checkAuthorization(active, applierId, applierRole)) {
			return sendErrorResponse(res, 403, 'Bạn không có quyền làm việc này');
		}

		const [err] = await activeService.applyScoreByUID(id, uid);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, 'Áp điểm thành công');
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// DELETE /active/:id/score/:uid
export async function removeScoreByUID(req, res) {
	try {
		// id: activity id, uid: user id để huỷ điểm
		const { id, uid } = req.params;
		if (isEmpty(id)) return sendErrorResponse(res, 400, 'Thiếu id');
		if (isEmpty(uid)) return sendErrorResponse(res, 400, 'Thiếu uid');
		
		const [errGet, active] = await activeService.getById(id);
		if (errGet) return sendErrorResponse(res, errGet.code || 404, errGet.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		const { uid: applierId, role: applierRole } = req.user;
		if (!checkAuthorization(active, applierId, applierRole)) {
			return sendErrorResponse(res, 403, 'Bạn không có quyền làm việc này');
		}

		const [err] = await activeService.removeScoreByUID(id, uid);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, 'Huỷ điểm thành công');
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// DELETE /active/:id/participants
export async function leave(req, res) {
	try {
		const { id } = req.params;
		const userId = req.user.uid;

		if (isEmpty(id) || isEmpty(userId)) {
			return sendErrorResponse(res, 400, 'Thiếu id hoặc userId');
		}

		const [err, active] = await activeService.removeRegisteredUser(id, userId);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		return sendJsonResponse(res, 200, 'Rời khỏi hoạt động thành công');
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// GET /active/:id/participants
export async function getParticipants(req, res) {
	try {
		const { id } = req.params;
		const { page = 1, limit = 10 } = req.query;

		if (isEmpty(id)) {
			return sendErrorResponse(res, 400, 'Thiếu id hoạt động');
		}

		const pageNum = parseInt(page);
		const limitNum = parseInt(limit);

		const [err, result] = await activeService.getParticipants(id, pageNum, limitNum);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, result);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// PATCH /active/:id/participants/:userId/score
export async function toggleParticipantScore(req, res) {
	try {
		const { id, userId } = req.params;

		if (isEmpty(id) || isEmpty(userId)) {
			return sendErrorResponse(res, 400, 'Thiếu id hoạt động hoặc userId');
		}

		const [err, result] = await activeService.toggleParticipantScore(id, userId);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, result);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// Utils
const checkAuthorization = (active, userId, userRole) => {
	return active.createdBy._id.toString() === userId || userRole === 'admin';
};

const handleServiceResponse = (res, err, data, successCode = 200, notFoundMessage = 'Không tìm thấy hoạt động') => {
	if (err) return sendErrorResponse(res, err.code || 404, err.message);
	if (!data) return sendErrorResponse(res, 404, notFoundMessage);
	return sendJsonResponse(res, successCode, data);
};
