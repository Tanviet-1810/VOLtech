/**
 * Enum các khóa sử dụng trong LocalStorage
 */
export const LOCAL_STORAGE_KEYS = {
	ACCESS_TOKEN: 'access_token',
};

/**
 * Service để tương tác với LocalStorage của trình duyệt.
 * Mặc định dữ liệu được lưu dưới dạng `JSON`.
 * @method static set(key, value) - Lưu dữ liệu vào LocalStorage
 * @method static get(key) - Lấy dữ liệu từ LocalStorage
 * @method static remove(key) - Xóa dữ liệu khỏi LocalStorage
 * @method static clear() - Xóa toàn bộ dữ liệu trong LocalStorage
 */
class LocalStorageService {
	/**
	 * Lưu dữ liệu vào LocalStorage
	 * @param {keyof LOCAL_STORAGE_KEYS} key - Khóa thuộc Enum `LOCAL_STORAGE_KEYS`
	 * @param {*} value - Có thể là bất kỳ kiểu dữ liệu nào
	 */
	static set(key, value) {
		try {
			const serializedValue = JSON.stringify(value);
			localStorage.setItem(key, serializedValue);
		} catch (e) {
			console.error('Lỗi khi lưu vào LocalStorage:', e);
		}
	}

	/**
	 * Lấy dữ liệu từ LocalStorage
	 * @param {keyof LOCAL_STORAGE_KEYS} key - Khóa thuộc Enum `LOCAL_STORAGE_KEYS`
	 * @returns {*} - Giá trị lưu trữ trong LocalStorage hoặc null nếu không tìm thấy
	 */
	static get(key) {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (e) {
			console.error('Lỗi khi lấy dữ liệu từ LocalStorage:', e);
			return null;
		}
	}

	/**
	 * Xóa dữ liệu khỏi LocalStorage
	 * @param {keyof LOCAL_STORAGE_KEYS} key - Khóa thuộc Enum `LOCAL_STORAGE_KEYS`
	 */
	static remove(key) {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			console.error('Lỗi khi xóa dữ liệu khỏi LocalStorage:', e);
		}
	}

	/**
	 * Xóa toàn bộ dữ liệu trong LocalStorage
	 */
	static clear() {
		try {
			localStorage.clear();
		} catch (e) {
			console.error('Lỗi khi xóa toàn bộ LocalStorage:', e);
		}
	}
}

export default LocalStorageService;
