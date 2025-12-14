import { JwtPayload } from 'jsonwebtoken';
import { pool } from '../../config/db';

const createBooking = async (
  userId: number,
  vehicleId: number,
  startDate: string,
  endDate: string
) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new Error('End date must be after start date');
    }

    const vehicleResult = await pool.query(
      `
      SELECT id, vehicle_name, daily_rent_price, availability_status
      FROM vehicles
      WHERE id = $1
      `,
      [vehicleId]
    );

    if (vehicleResult.rows.length === 0) {
      throw new Error('Vehicle not found');
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== 'available') {
      throw new Error('Vehicle is not available for booking');
    }

    const diffTime = end.getTime() - start.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * vehicle.daily_rent_price;

    const bookingResult = await pool.query(
      `
      INSERT INTO bookings
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES
        ($1, $2, $3, $4, $5, 'active')
      RETURNING *
      `,
      [userId, vehicleId, startDate, endDate, totalPrice]
    );
    const booking = bookingResult.rows[0];

    await pool.query(
      `
      UPDATE vehicles
      SET availability_status = 'booked'
      WHERE id = $1
      `,
      [vehicleId]
    );

    return {
      id: booking.id,
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      rent_start_date: booking.rent_start_date,
      rent_end_date: booking.rent_end_date,
      total_price: booking.total_price,
      status: booking.status,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } catch (error: any) {
    console.log({ error });
    throw new Error('Error creating booking', error);
  }
};

const getBookings = async (user: JwtPayload) => {
  try {
    const bookingsResult = await pool.query(
      `
      SELECT * FROM bookings
      `
    );
    const bookings = bookingsResult.rows;

    const mappedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const vehicleResult = await pool.query(
          `
          SELECT vehicle_name, registration_number, type FROM vehicles WHERE id = $1
          `,
          [booking.vehicle_id]
        );

        const customer = await pool.query(
          `
          SELECT name, email FROM users WHERE id = $1
          `,
          [booking.customer_id]
        );
        const vehicle = vehicleResult.rows[0];

        if (user.role === 'admin') {
          return {
            ...booking,
            customer: {
              name: customer.rows[0].name,
              email: customer.rows[0].email,
            },
            vehicle: {
              vehicle_name: vehicle.vehicle_name,
              registration_number: vehicle.registration_number,
            },
          };
        }
        return {
          ...booking,
          vehicle: {
            vehicle_name: vehicle.vehicle_name,
            registration_number: vehicle.registration_number,
            type: vehicle.type,
          },
        };
      })
    );

    if (user.role === 'customer') {
      return mappedBookings.filter(
        (booking) => booking.customer_id === user.id
      );
    }
    return mappedBookings;
  } catch (error: any) {
    throw new Error('Error retrieving bookings', error);
  }
};

const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const result = await pool.query(
      `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, bookingId]
    );

    if (result.rows.length === 0) {
      throw new Error('Booking not found');
    }

    return result.rows[0];
  } catch (error: any) {
    console.log({ error });
    throw new Error('Error updating booking status', error);
  }
};

export const bookingService = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
