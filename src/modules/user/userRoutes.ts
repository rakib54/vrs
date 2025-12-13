import express from 'express';
import authMiddleware from '../../middleware/auth';
import { userControllers } from './userControllers';

const router = express.Router();

router.get('/users', authMiddleware, userControllers.getUsers);
router.put('/users/:userId', authMiddleware, userControllers.updateUser);
router.delete('/users/:userId', authMiddleware, userControllers.deleteUser);

export const userRoutes = router;
