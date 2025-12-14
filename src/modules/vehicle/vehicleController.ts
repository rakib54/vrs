import { Request, Response } from 'express';
import { vehicleService } from './vehicleService';

const createVehicle = async (req: Request, res: Response) => {
  // create a vehicle
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  const user = req.user;

  if (user?.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden: Admins only' });
  }

  try {
    const newVehicle = await vehicleService.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    res.status(201).send({
      success: true,
      message: 'Vehicle created successfully',
      data: newVehicle,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error creating vehicle', error });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const allVehicles = await vehicleService.getAllVehicles();
    if (allVehicles.length === 0) {
      res.status(200).send({
        success: true,
        message: 'No vehicles found',
        data: [],
      });
    }
    res.status(200).send({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: allVehicles,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving vehicles', error });
  }
};

const getVehiclesById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const getVehiclesById = await vehicleService.getVehicleById(
      vehicleId as string
    );
    if (!getVehiclesById) {
      return res.status(404).send({
        success: false,
        message: 'Vehicle not found',
      });
    }
    res.status(200).send({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: getVehiclesById,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving vehicle', error });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  const user = req.user;

  if (user?.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden: Admins only' });
  }

  try {
    const deleted = await vehicleService.deleteVehicle(vehicleId as string);
    if (!deleted) {
      return res.status(404).send({
        success: false,
        message: 'Vehicle not found',
      });
    }
    res.status(200).send({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting vehicle', error });
  }
};

export const vehicleControllers = {
  createVehicle,
  getVehicles,
  getVehiclesById,
  deleteVehicle,
};
