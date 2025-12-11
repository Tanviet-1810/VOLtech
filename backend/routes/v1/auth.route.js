import { Router } from 'express';
import { login, logout, refresh, register } from '../../controllers/v1/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;
