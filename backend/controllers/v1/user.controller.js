import userService from '../../services/user.service.js';
import { isEmpty } from '../../utils/type-check.js';
import { mapOrderSort } from '../../utils/index.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';
import { USER_ROLES } from '../../enums/roles.js'; // <-- import roles

export const getMe = async (req, res) => {
	try {
		const [errUser, user] = await userService.getById(req.user.uid, { passwordHashed: 0, salt: 0 }, { lean: true });
		if (errUser) {
			return res.status(404).json({ error: errUser.message });
		}

		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
	}
};

export const getUsers = async (req, res) => {
	try {
		const { page, limit, name, email, role, sortBy, sortOrder } = req.query;
		const options = {
			page: Number(page) || 1,
			limit: Number(limit) || 10,
		};

		const query = {};
		if (!isEmpty(name)) query.name = { $regex: `${name}`, $options: 'i' };
		if (!isEmpty(email)) query.email = { $regex: `${email}`, $options: 'i' };
		if (!isEmpty(role)) query.role = role;

		if (!isEmpty(sortBy)) {
			options.sort = { [sortBy]: mapOrderSort(sortOrder) };
		}

		const [err, users, errCount, totalUsers] = await Promise.all([userService.getList(query, { passwordHashed: 0, salt: 0 }, options), userService.count(query)]).then(([listResult, countResult]) => [...listResult, ...countResult]);

		if (err) return res.status(err.code || 404).json({ error: err.message });

		const paginate = {
			totalItems: errCount ? 0 : totalUsers,
			currentPage: options.page,
			totalPages: errCount ? 1 : Math.ceil(totalUsers / options.limit),
			limit: options.limit,
		};

		return res.status(200).json({ items: users, paginate });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			body: data,
			user: { uid: userId, role: userRole },
		} = req;

		if (isEmpty(id)) return sendErrorResponse(res, 400, 'Thiếu id');
		if (isEmpty(data)) return sendErrorResponse(res, 400, 'Thiếu dữ liệu cập nhật');

		if (id !== userId && userRole !== USER_ROLES.ADMIN) {
			return sendErrorResponse(res, 403, 'Bạn không có quyền cập nhật tài khoản này');
		}

		const [errUpdate, updatedUser] = await userService.patchUpdate(id, data);
		if (errUpdate) return sendErrorResponse(res, errUpdate.code || 404, errUpdate.message);
		if (!updatedUser) return sendErrorResponse(res, 404, 'Không tìm thấy người dùng');

		const { passwordHashed, salt, ...userResponse } = updatedUser.toObject ? updatedUser.toObject() : updatedUser;

		return sendJsonResponse(res, 200, userResponse);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
};
