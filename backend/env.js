import { config } from 'dotenv';
import { z } from 'zod';
config();

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']),
	MONGODB_URI: z.string().url().or(z.string().startsWith('mongodb://')),
	JWT_SECRET: z.string().min(10),
	JWT_EXPIRES_IN: z.string(),
	JWT_REFRESH_EXPIRES_IN: z.string(),
	HOST: z.string(),
	PORT: z.string().transform(Number),
	CORS_ORIGIN: z.string().optional(),
	CORS_METHODS: z.string(),
	CORS_CREDENTIALS: z.string().transform((v) => v === 'true'),
});

const env = envSchema.parse(process.env);
export default env;
