import mongoose from 'mongoose';
import env from '../env.js';

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export function database(req, res, next) {
	if (cached.conn) return next();

	if (!cached.promise) {
		cached.promise = mongoose.connect(env.MONGODB_URI, { bufferCommands: false });
	}

	cached.promise
		.then((conn) => {
			cached.conn = conn;
			next();
		})
		.catch(next);
}
