import { pool } from '../../config/db';

const createVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: boolean
) => {
  try {
    const createNewVehicle = await pool.query(
      `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );

    return createNewVehicle.rows[0];
  } catch (error) {
    throw new Error('Error creating vehicle');
  }
};

const getAllVehicles = async () => {
  try {
    const allVehicles = await pool.query(`SELECT * FROM vehicles`);

    return allVehicles.rows;
  } catch (error) {
    throw new Error('Error retrieving vehicles');
  }
};

const getVehicleById = async (vehicleId: string) => {
  try {
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      vehicleId,
    ]);
    return vehicle.rows[0];
  } catch (error) {
    throw new Error('Error retrieving vehicle by ID');
  }
};

const deleteVehicle = async (vehicleId: string) => {
  try {
    const deletedVehicle = await pool.query(
      `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
      [vehicleId]
    );

    return deletedVehicle.rows[0];
  } catch (error) {
    throw new Error('Error deleting vehicle');
  }
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
};
