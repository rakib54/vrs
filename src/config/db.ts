import { Pool } from 'pg';
import config from '.';

export const pool = new Pool({
  connectionString: config.connectionString,
  ssl: { rejectUnauthorized: false },
});

const initDb = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL CHECK (email = LOWER(email)),
      password VARCHAR(100) NOT NULL CHECK (LENGTH(password) >= 6),
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer'))
    )`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
    )`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS Bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id),
      vehicle_id INT REFERENCES vehicles(id),
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
      total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
      status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
    )`);
  } catch (error) {
    console.log(`Not Created ${error}`);
  }
};

export default initDb;
