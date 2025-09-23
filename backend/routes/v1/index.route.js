import { Router } from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import communeRoute from './commune.route.js';
import provinceRoute from './province.route.js';
import activeRoute from './active.route.js';

const v1Api = Router();

v1Api.use('/auth', authRoutes);
v1Api.use('/user', userRoutes);
v1Api.use('/active', activeRoute);
v1Api.use('/commune', communeRoute);
v1Api.use('/province', provinceRoute);

export default v1Api;
