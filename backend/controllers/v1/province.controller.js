import provinceService from '../../services/province.service.js';
import { isEmpty } from '../../utils/type-check.js';
import { generatePaginateOptions } from '../../utils/index.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';

// GET /province
export async function getList(req, res) {
	try {
		const { page, limit, name, code } = req.query;
		const paginateOptions = generatePaginateOptions(page, limit);

		const query = {};
		if (!isEmpty(name)) {
			query.name = { $regex: `${name}`, $options: 'i' };
		}
		if (!isEmpty(code)) {
			query.code = String(code).toUpperCase();
		}

		const [listResult, countResult] = await Promise.all([provinceService.getList(query, {}, paginateOptions), provinceService.count(query)]);
		const [err, provinces] = listResult;
		const [errPaginate, totalItems] = countResult;

		const paginate = {
			totalItems: errPaginate ? 0 : totalItems,
			currentPage: paginateOptions.page,
			totalPages: errPaginate ? 1 : Math.ceil(totalItems / paginateOptions.limit),
			limit: paginateOptions.limit,
		};

		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, { items: provinces, paginate });
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// GET /province/:id
export async function getById(req, res) {
	try {
		const { id } = req.params;
		if (isEmpty(id)) {
			return sendErrorResponse(res, 400, 'Thiếu id');
		}

		const [err, province] = await provinceService.getById(id);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!province) return sendErrorResponse(res, 404, 'Không tìm thấy tỉnh/thành phố');

		return sendJsonResponse(res, 200, province);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}
