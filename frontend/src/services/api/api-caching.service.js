const storage = new Map();

const setApiCache = (key, value) => {
	storage.set(key, value);
	return value;
};

const hasApiCache = (key) => {
	return storage.has(key);
};

const getApiCache = (key) => {
	return storage.get(key) || null;
};

const removeApiCache = (key) => {
	if (key) {
		storage.delete(key);
	} else {
		storage.clear();
	}
};

/**
 * Higher-order function để cache kết quả trả về của một Promise
 * @param {*} key Khóa duy nhất để lưu trữ kết quả trong bộ nhớ đệm
 * @param {*} promise Hàm trả về Promise cần được cache
 * @param  {...any} args Tham số truyền vào hàm Promise
 * @returns {Promise} Kết quả của Promise, có thể là từ bộ nhớ đệm hoặc thực thi mới
 */
export const withApiCache = (key, promise, ...args) => {
	if (hasApiCache(key)) return getApiCache(key);
	return setApiCache(
		key,
		promise(...args).finally(() => removeApiCache(key))
	);
};
