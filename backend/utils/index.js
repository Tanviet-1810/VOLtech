import { isBoolean, isNumber, isString, isEmpty } from './type-check.js';

/**
 * Tạo options cho mongoose query để thực hiện paginate.
 * @param {*} page - Số trang.
 * @param {*} limit - Giới hạn mỗi trang.
 */
export function generatePaginateOptions(page, limit) {
	if (isEmpty(page) || page < 1) page = 1;
	if (isEmpty(limit) || limit < 0) limit = 10;
	const result = {};

	result.limit = limit;
	result.skip = (page - 1) * limit;

	return result;
}

/**
 * Trích xuất token Bearer từ header Authorization của request.
 * @param {import('http').IncomingMessage} req - Đối tượng request.
 * @returns {string|null} Token nếu tồn tại, ngược lại trả về null.
 */
export function extractBearerToken(req) {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader || typeof authHeader !== 'string') return null;
	const match = authHeader.match(/^Bearer\s+(.+)$/i);
	return match ? match[1] : null;
}

/**
 * Chuyển đổi giá trị order thành số thứ tự sắp xếp (1 hoặc -1) cho MongoDB sort.
 * @param {number|boolean|string} order - Giá trị thứ tự sắp xếp, có thể là số, boolean hoặc chuỗi.
 *   - Nếu là số: 1 sẽ trả về 1 (tăng dần), các giá trị khác trả về -1 (giảm dần).
 *   - Nếu là boolean: true trả về 1, false trả về -1.
 *   - Nếu là chuỗi: 'asc', '1', 'true' trả về 1; 'desc', '-1', 'false' trả về -1.
 * @returns {number} Số thứ tự sắp xếp: 1 (tăng dần) hoặc -1 (giảm dần). Nếu không hợp lệ sẽ trả về -1.
 */
export function mapOrderSort(order) {
	if (isNumber(order)) return order === 1 ? 1 : -1;
	if (isBoolean(order)) return order ? 1 : -1;
	if (isString(order)) {
		const val = order.trim().toLowerCase();
		if (['asc', '1', 'true'].includes(val)) return 1;
		if (['desc', '-1', 'false'].includes(val)) return -1;
	}
	return -1;
}
