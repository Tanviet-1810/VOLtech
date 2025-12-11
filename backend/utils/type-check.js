/**
 * Kiểm tra input có phải là boolean.
 */
export function isBoolean(value) {
	return typeof value === 'boolean';
}

/**
 * Kiểm tra input có phải là số.
 */
export function isNumber(value) {
	return typeof value === 'number' && !isNaN(value);
}

/**
 * Kiểm tra input có phải là string.
 */
export function isString(value) {
	return typeof value === 'string';
}

/**
 * Kiểm tra input có phải là mảng.
 */
export function isArray(value) {
	return Array.isArray(value);
}

/**
 * Kiểm tra input có phải là object thuần (không phải null, array, function).
 */
export function isObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Kiểm tra giá trị có rỗng hay không.
 */
export function isEmpty(value) {
	if (value == null) return true;
	if (isString(value)) return value.trim().length === 0;
	if (isArray(value)) return value.length === 0;
	if (isObject(value)) return Object.keys(value).length === 0;
	return false;
}
