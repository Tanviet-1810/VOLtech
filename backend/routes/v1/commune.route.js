import { Router } from 'express';
import { getList, getById } from '../../controllers/v1/commune.controller.js';

const router = Router();

router.get('/', getList);
router.get('/:id', getById);

export default router;
