import { Router } from 'express';
import { getList, create, getById, update, remove, join, leave } from '../../controllers/v1/active.controller.js';
import { attachUser, requireAuth, requireRoles } from '../../middleware/index.js';
import { USER_ROLES } from '../../enums/roles.js';

const router = Router();

// Public routes
router.get('/', attachUser, getList);
router.get('/:id', getById);

// Protected routes - require authentication
router.use(requireAuth);

// User routes
router.post('/:id/participants', join);
router.delete('/:id/participants', leave);

// Admin and Moderator routes
const adminModeratorRoles = [USER_ROLES.ADMIN, USER_ROLES.MODERATOR];

router.post('/', requireRoles(adminModeratorRoles), create);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;
