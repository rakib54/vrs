import { Request, Response } from 'express';
import { bookingService } from './bookingService';

const createBooking = async (req: Request, res: Response) => {
  try {
    const { vehicle_id, customer_id, rent_start_date, rent_end_date } =
      req.body;

    const newBooking = await bookingService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );
    console.log({ newBooking });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

export const bookingController = {
  createBooking,
};
