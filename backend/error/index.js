import { isEmpty, isObject } from '../utils/type-check.js';

export function ErrorResult(code, message, ...rest) {
	if (isEmpty(code) || isEmpty(message)) throw new Error('Code and message of AppError must not be null');

	return {
		code,
		message,
		...rest,
	};
}

export function RepositoryValidationError(error) {
	if (!error || typeof error !== 'object' || error.name !== 'ValidationError' || !error.errors) {
		console.error(error);
		return ErrorResult(400, 'Lỗi không xác định');
	}
	const fields = Object.keys(error.errors);
	const details = {};
	let message = 'Các trường không phù hợp với kiểu: ' + fields.join(', ');
	return ErrorResult(400, message, { fields, details });
}

export function RepositoryCastError(error) {
	if (!error || typeof error !== 'object' || error.name !== 'CastError') {
		console.error(error);
		return ErrorResult(400, 'Lỗi không xác định');
	}
	const field = error.path || 'unknown';
	const value = error.value;
	const message = `Giá trị không hợp lệ cho trường '${field}': ${value}`;
	return ErrorResult(400, message, { field, value });
}

export function RepositoryDuplicateKeyError(error) {
	if (!error || typeof error !== 'object' || error.code !== 11000) {
		console.error(error);
		return ErrorResult(400, 'Lỗi không xác định');
	}
	const fields = Object.keys(error.keyValue || {});
	const message = `Trùng lặp giá trị cho trường: ${fields.join(', ')}`;
	return ErrorResult(400, message, { fields, keyValue: error.keyValue });
}

export function RepositoryError(error) {
	if (isObject(error)) {
		if (error.name === 'ValidationError') return RepositoryValidationError(error);
		if (error.name === 'CastError') return RepositoryCastError(error);
		if (error.code === 11000) return RepositoryDuplicateKeyError(error);
		return ErrorResult(400, error.message || 'Lỗi không xác định', error);
	}
	return ErrorResult(400, 'Lỗi không xác định', error);
}
