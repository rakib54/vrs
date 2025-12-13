import express from 'express';
import authMiddleware from '../../middleware/auth';
import { userControllers } from './userControllers';

const router = express.Router();

router.get('/users', authMiddleware, userControllers.getUsers);
router.put('/users/:userId', userControllers.updateUsers);

export const userRoutes = router;
