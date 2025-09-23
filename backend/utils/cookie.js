/**
 * Đặt cookie trong header của response (ExpressJS).
 * @param {import('express').Response} res - Đối tượng response Express.
 * @param {string} name - Tên cookie.
 * @param {string} value - Giá trị cookie.
 * @param {object} options - Các tuỳ chọn cookie như maxAge, domain, path, expires, httpOnly, secure, sameSite.
 */
export function setCookie(res, name, value, options = {}) {
	res.cookie(name, value, options);
}

/**
 * Lấy giá trị cookie từ request (ExpressJS).
 * @param {import('express').Request} req - Đối tượng request Express.
 * @param {string} name - Tên cookie cần lấy.
 * @returns {string|null} Giá trị cookie nếu tồn tại, ngược lại trả về null.
 */
export function getCookie(req, name) {
	return req.cookies?.[name] ?? null;
}
