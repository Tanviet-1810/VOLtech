/**
 * Gửi response dạng JSON về client (ExpressJS).
 * @param {import('express').Response} res - Đối tượng response của Express.
 * @param {number} statusCode - Mã trạng thái HTTP.
 * @param {Object} data - Dữ liệu trả về dạng JSON.
 */
export function sendJsonResponse(res, statusCode, data) {
	res.status(statusCode).json(data);
}

/**
 * Gửi response lỗi về client dưới dạng JSON, cho phép custom thêm dữ liệu (ExpressJS).
 * @param {import('express').Response} res - Đối tượng response của Express.
 * @param {number} statusCode - Mã trạng thái HTTP lỗi.
 * @param {string|Object} message - Thông báo lỗi hoặc object lỗi.
 * @param {Object} [rest] - Dữ liệu bổ sung tuỳ chọn.
 */
export function sendErrorResponse(res, statusCode, message, rest = {}) {
	const errorObj = typeof message === 'string' ? { error: message, ...rest } : { ...message, ...rest };
	sendJsonResponse(res, statusCode, errorObj);
}
