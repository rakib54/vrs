import express from 'express';
import authMiddleware from '../../middleware/auth';
import { bookingController } from './bookingController';

const router = express.Router();

router.post('/bookings', authMiddleware, bookingController.createBooking);

export const bookingRouter = router;
