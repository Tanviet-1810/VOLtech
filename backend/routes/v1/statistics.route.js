import { Router } from 'express';
import { statisticsController } from '../../controllers/v1/statistics.controller.js';

const statisticsRoute = Router();

statisticsRoute.get('/', statisticsController.getOverallStatistics);

export default statisticsRoute;
