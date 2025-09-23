import env from '../env.js';

const allowedOrigins = env.CORS_ORIGIN
	? env.CORS_ORIGIN.split(',')
			.map((o) => o.trim())
			.filter(Boolean)
	: ['*'];
const allowedMethods = env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS';
const allowCredentials = env.CORS_CREDENTIALS;

export function cors(req, res, next) {
	const origin = req.headers.origin;
	if (allowedOrigins.includes('*')) {
		res.header('Access-Control-Allow-Origin', '*');
	} else if (origin && allowedOrigins.includes(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
	}

	res.header('Access-Control-Allow-Methods', allowedMethods);
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (allowCredentials) {
		res.header('Access-Control-Allow-Credentials', 'true');
	}

	if (req.method === 'OPTIONS') {
		res.sendStatus(204);
		return;
	}

	next();
}
