import express from 'express';
import { authControllers } from './authControllers';

const router = express.Router();

router.post('/auth/signup', authControllers.createUser);

router.post('/auth/signin', authControllers.userLogin);

export const authRoutes = router;
