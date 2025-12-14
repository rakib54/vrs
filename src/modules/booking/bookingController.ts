import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
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

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const bookings = await bookingService.getBookings(user);
    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving bookings', error });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId as string,
      status
    );

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: updatedBooking,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
