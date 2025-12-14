import express from 'express';
import authMiddleware from '../../middleware/auth';
import { bookingController } from './bookingController';

const router = express.Router();

router.post('/bookings', authMiddleware, bookingController.createBooking);
router.get('/bookings', authMiddleware, bookingController.getBookings);
router.put(
  '/bookings/:bookingId',
  authMiddleware,
  bookingController.updateBooking
);

export const bookingRouter = router;
