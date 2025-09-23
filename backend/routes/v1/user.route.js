import { Router } from 'express';
import { requireAuth } from '../../middleware/index.js';
import { getMe, getUsers, updateUser } from '../../controllers/v1/user.controller.js';

const router = Router();

router.get('/me', requireAuth, getMe);
router.get('/', requireAuth, getUsers);
router.patch('/:id', requireAuth, updateUser);

export default router;
