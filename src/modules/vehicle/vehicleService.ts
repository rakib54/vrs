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
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      vehicleId,
    ]);

    const vehicleToDelete = vehicle.rows[0];

    if (vehicleToDelete?.availability_status === 'booked') {
      return null;
    }
    await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`, [
      vehicleId,
    ]);

    return true;
  } catch (error) {
    throw new Error('Error deleting vehicle');
  }
};

type UpdateVehicleData = {
  vehicle_name?: string;
  type?: string;
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: boolean;
};

const updateVehicleById = async (
  vehicleId: String,
  updateData: UpdateVehicleData
) => {
  try {
    try {
      const fields = Object.keys(updateData);

      if (fields.length === 0) {
        return null;
      }

      // Build SET clause dynamically
      const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');

      const values = Object.values(updateData);

      const query = `
      UPDATE vehicles
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;

      const result = await pool.query(query, [...values, vehicleId]);

      return result.rows[0] || null;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating vehicle');
    }
  } catch (error) {
    throw new Error('Error updating vehicle');
  }
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
  updateVehicleById,
};
