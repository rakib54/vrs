import { Request, Response } from 'express';
import { bookingService } from './bookingService';

const createBooking = async (req: Request, res: Response) => {
  try {
    const { vehicle_id, user_id, start_date, end_date } = req.body;

    // Logic to create a booking in the database
    const newBooking = await bookingService.createBooking(
      vehicle_id,
      user_id,
      start_date,
      end_date
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
};

export const bookingController = {
  createBooking,
};
