import { z } from 'zod';

const envSchema = z.object({
	VITE_API_BASE_URL: z.string().url().default('http://localhost'),
	VITE_API_PORT: z.string().regex(/^\d+$/).default('3000'),
	VITE_API_PREFIX: z.string().default('/api'),
	VITE_API_VER: z.string().default('/v1'),
	VITE_API_TIMEOUT: z.coerce.number().default(5000),
});

const ENV = envSchema.parse({
	VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
	VITE_API_PORT: import.meta.env.VITE_API_PORT,
	VITE_API_PREFIX: import.meta.env.VITE_API_PREFIX,
	VITE_API_VER: import.meta.env.VITE_API_VER,
	VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
});

const APP_CONFIG = {
	api: {
		baseURL: ENV.VITE_API_BASE_URL,
		port: ENV.VITE_API_PORT,
		prefix: ENV.VITE_API_PREFIX,
		ver: ENV.VITE_API_VER,
		timeout: ENV.VITE_API_TIMEOUT,
		getFullPath: (path) => {
			const port = APP_CONFIG.api.port ? `:${APP_CONFIG.api.port}` : '';
			return `${APP_CONFIG.api.baseURL}${port}${APP_CONFIG.api.prefix}${APP_CONFIG.api.ver}${path}`;
		},
	},
};

export default APP_CONFIG;
