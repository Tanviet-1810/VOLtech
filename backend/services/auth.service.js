import crypto from 'crypto';
import userService from './user.service.js';
import tokenService from './token.service.js';
import { isEmpty } from '../utils/type-check.js';
import { ErrorResult, RepositoryError } from '../error/index.js';

class AuthService {
	static _instance = null;

	static getInstance() {
		if (!AuthService._instance) {
			AuthService._instance = new AuthService();
		}
		return AuthService._instance;
	}

	_hashPassword(password, salt) {
		if (salt && typeof salt === 'object' && salt._bsontype === 'Binary' && salt.buffer) {
			salt = Buffer.from(salt.buffer);
		}
		return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
	}

	async register(userData) {
		try {
			if (isEmpty(userData)) return [ErrorResult(400, 'Thiếu dữ liệu người dùng')];

			const { password, ...rest } = userData;
			if (!password) return [ErrorResult(400, 'Mật khẩu là bắt buộc')];

			const [errExists, exists] = await userService.exists({ email: userData.email });
			if (errExists) return [errExists];
			if (exists) return [ErrorResult(409, 'Email đã được sử dụng')];

			let salt, passwordHashed;
			try {
				salt = crypto.randomBytes(16);
				passwordHashed = this._hashPassword(password, salt);
			} catch (error) {
				return [ErrorResult(500, 'Lỗi khi xử lý mật khẩu')];
			}

			const [errCreate] = await userService.create({ ...rest, passwordHashed, salt });
			if (errCreate) return [errCreate];

			return [null, 'Đăng ký thành công'];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async login(email, password) {
		try {
			const [errUser, user] = await userService.getByEmail(email);
			if (errUser) return [errUser];
			if (isEmpty(user)) return [ErrorResult(401, 'Email hoặc mật khẩu không đúng')];

			const hashed = this._hashPassword(password, user.salt);
			if (hashed !== user.passwordHashed) return [ErrorResult(401, 'Email hoặc mật khẩu không đúng')];

			const [errAccessToken, accessToken] = await tokenService.generateAccessToken({ uid: user._id, email: user.email, role: user.role });
			if (errAccessToken) return [errAccessToken];

			const [errRefreshToken, refreshToken] = await tokenService.generateRefreshToken({ uid: user._id, email: user.email });
			if (errRefreshToken) return [errRefreshToken];

			return [null, { accessToken, refreshToken }];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async refreshAccessToken(refreshToken) {
		try {
			const [errDoc, doc] = await tokenService.getTokenDoc(refreshToken);
			if (errDoc) return [errDoc];
			if (isEmpty(doc)) return [ErrorResult(401, 'Token làm mới không hợp lệ')];
			if (doc.blacklisted) return [ErrorResult(401, 'Token làm mới đã bị thu hồi')];

			const [errVerify, payload] = await tokenService.verifyToken(refreshToken);
			if (errVerify) return [errVerify];

			const [errAccessToken, accessToken] = await tokenService.generateAccessToken({ uid: payload.id, email: payload.email, role: payload.role });
			if (errAccessToken) return [errAccessToken];

			const [errNewRefreshToken, newRefreshToken] = await tokenService.generateRefreshToken({ uid: payload.id, email: payload.email });
			if (errNewRefreshToken) return [errNewRefreshToken];

			await tokenService.blacklistToken(refreshToken);

			return [null, { accessToken: accessToken, refreshToken: newRefreshToken }];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async logout(refreshToken) {
		try {
			const [err] = await tokenService.blacklistToken(refreshToken);
			if (err) return [err];
			return [null, 'Đăng xuất thành công'];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}
}

const authService = AuthService.getInstance();
export default authService;
