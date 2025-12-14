import { pool } from '../../config/db';

const createBooking = async (
  userId: number,
  vehicleId: number,
  startDate: string,
  endDate: string
) => {
  try {
    const booking = await pool.query(
      'INSERT INTO bookings (user_id, vehicle_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, vehicleId, startDate, endDate]
    );
    return booking.rows[0];
  } catch (error) {
    throw new Error('Error creating booking');
  }
};

export const bookingService = {
  createBooking,
};
