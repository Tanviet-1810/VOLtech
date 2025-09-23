import tokenService from '../services/token.service.js';
import { sendErrorResponse } from '../utils/response.js';
import { extractBearerToken } from '../utils/index.js';

// Đính kèm thông tin user nếu có token hợp lệ
export async function attachUser(req, res, next) {
	const token = extractBearerToken(req);
	if (!token) {
		req.user = null;
		return next();
	}

	const [err, payload] = await tokenService.verifyToken(token);
	req.user = !err && payload ? payload : null;
	next();
}

// Yêu cầu xác thực danh tính
export async function requireAuth(req, res, next) {
	const token = extractBearerToken(req);
	if (!token) {
		return sendErrorResponse(res, 401, 'Bạn chưa xác thực danh tính');
	}

	const [err, payload] = await tokenService.verifyToken(token);
	if (err || !payload) {
		return sendErrorResponse(res, 401, 'Bạn chưa xác thực danh tính');
	}
	req.user = payload;
	next();
}

// Yêu cầu xác thực danh tính và có ít nhất một trong các vai trò được phép
export function requireRoles(allowedRoles) {
	return (req, res, next) => {
		const user = req.user;
		if (!user || !user.role) {
			return sendErrorResponse(res, 403, 'Bạn không có đủ quyền hạn truy cập tài nguyên');
		}

		const userRoles = Array.isArray(user.role) ? user.role : [user.role];
		const hasRole = userRoles.some((r) => allowedRoles.some((role) => new RegExp(role, 'i').test(r)));

		if (!hasRole) {
			return sendErrorResponse(res, 403, 'Bạn không có đủ quyền hạn truy cập tài nguyên');
		}

		next();
	};
}
