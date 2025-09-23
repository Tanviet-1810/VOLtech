import authService from '../../services/auth.service.js';
import { isEmpty } from '../../utils/type-check.js';
import { getCookie, setCookie } from '../../utils/cookie.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';

// POST /auth/register
export async function register(req, res) {
	try {
		const { name, email, password, birthDate, unit, phone } = req.body;
		if (!name || !email || !password) {
			return sendErrorResponse(res, 400, 'Thiếu trường bắt buộc');
		}
		const [error, message] = await authService.register({ name, email, password, birthDate, unit, phone });
		if (error) return sendErrorResponse(res, error.code || 400, error.message || error);
		return sendJsonResponse(res, 201, { message });
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// POST /auth/login
export async function login(req, res) {
	try {
		const { email = '', password = '' } = req.body;
		if (!email.trim() || !password.trim()) {
			return sendErrorResponse(res, 400, 'Email và mật khẩu là bắt buộc');
		}
		const [error, result] = await authService.login(email, password);
		if (error) return sendErrorResponse(res, error.code || 401, error.message || error);
		setCookie(res, 'refreshToken', result.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			expires: new Date(Date.now() + 7.25 * 24 * 60 * 60 * 1000),
		});
		return sendJsonResponse(res, 200, { accessToken: result.accessToken });
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// POST /auth/refresh
export async function refresh(req, res) {
	try {
		const oldRefreshToken = getCookie(req, 'refreshToken');
		if (isEmpty(oldRefreshToken)) return sendErrorResponse(res, 401, 'Token làm mới không hợp lệ');

		const [err, data] = await authService.refreshAccessToken(oldRefreshToken);
		if (err) return sendErrorResponse(res, err.code || 401, err.message || err);
		const { accessToken, refreshToken: newRefreshToken } = data;

		setCookie(res, 'refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			expires: new Date(Date.now() + 7.25 * 24 * 60 * 60 * 1000),
		});

		return sendJsonResponse(res, 200, { accessToken });
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// POST /auth/logout
export async function logout(req, res) {
	try {
		const refreshToken = getCookie(req, 'refreshToken');
		if (!isEmpty(refreshToken)) {
			await authService.logout(refreshToken);
			setCookie(res, 'refreshToken', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'Strict',
				expires: new Date(0),
			});
		}
		return sendJsonResponse(res, 200, { message: 'Đăng xuất thành công' });
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi server');
	}
}
