import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import tokenRepository from '../repository/token.repository.js';
import { ErrorResult, RepositoryError } from '../error/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

class TokenService {
	static _instance = null;

	static getInstance() {
		if (!TokenService._instance) {
			TokenService._instance = new TokenService();
		}
		return TokenService._instance;
	}

	async generateAccessToken(payload) {
		try {
			const jti = this._genId('act');
			const token = jwt.sign({ jti, ...payload }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
			const tokenDoc = this._createTokenDoc(token, jti);
			await tokenRepository.create(tokenDoc);
			return [null, token];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async generateRefreshToken(payload) {
		try {
			const jti = this._genId('rft');
			const token = jwt.sign({ jti, ...payload }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
			const tokenDoc = this._createTokenDoc(token, jti);
			await tokenRepository.create(tokenDoc);
			return [null, token];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async verifyToken(token) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET);

			const isBlacklisted = await tokenRepository.isBlacklisted(token);
			if (isBlacklisted) return [ErrorResult(401, 'Token đã bị thu hồi hoặc không hợp lệ')];

			return [null, decoded];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async blacklistToken(token) {
		try {
			const payload = jwt.decode(token);
			if (!payload || !payload.jti) return [ErrorResult(401, 'Token không hợp lệ')];

			const result = await tokenRepository.blacklistToken(payload.jti);
			return [null, result];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getTokenDoc(token) {
		try {
			const payload = jwt.decode(token);
			if (!payload || !payload.jti) return [ErrorResult(401, 'Token không hợp lệ')];

			const doc = await tokenRepository.findById(payload.jti);
			if (!doc) return [ErrorResult(404, 'Token không tồn tại')];

			return [null, doc];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	async getPayload(token) {
		try {
			const payload = jwt.decode(token);
			return [null, payload];
		} catch (error) {
			return [RepositoryError(error)];
		}
	}

	_genId(prefix) {
		return `${prefix}_${uuidv4()}`;
	}

	_createTokenDoc(token, jti) {
		return {
			_id: jti || this._genId('tok'),
			token,
			blacklisted: false,
		};
	}
}

const tokenService = TokenService.getInstance();
export default tokenService;
