import { Router } from 'express';
import v1Api from './v1/index.route.js';

const api = Router();

api.use('/v1', v1Api);

export default api;
