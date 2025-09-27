import express from 'express';
import { getNotifications, createNotification, markNotificationRead } from '../../controllers/v1/notification.controller.js';
import { requireAuth } from '../../middleware/index.js';

const router = express.Router();

router.get('/', requireAuth, getNotifications);
router.post('/', requireAuth, createNotification);
router.patch('/:id/read', requireAuth, markNotificationRead);

export default router;