import { Router } from 'express';
import {
    getList,
    create,
    getById,
    update,
    remove,
    join,
    leave,
    applyScoreByUID,
    removeScoreByUID
} from '../../controllers/v1/active.controller.js';
import { attachUser, requireAuth, requireRoles } from '../../middleware/index.js';
import { USER_ROLES } from '../../enums/roles.js';

const router = Router();

router.get('/', attachUser, getList);
router.get('/:id', getById);

router.use(requireAuth);
router.post('/:id/participants', join);
router.delete('/:id/participants', leave);

const adminModeratorRoles = [USER_ROLES.ADMIN, USER_ROLES.MODERATOR];

router.post('/', requireRoles(adminModeratorRoles), create);
router.post('/:id/score/:uid', requireRoles(adminModeratorRoles), applyScoreByUID);
router.delete('/:id/score/:uid', requireRoles(adminModeratorRoles), removeScoreByUID);
router.patch('/:id', requireRoles(adminModeratorRoles), update);
router.delete('/:id', requireRoles(adminModeratorRoles), remove);

export default router;
