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
        message: 'Booked vehicle cannot be deleted',
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

const updateVehiclesById = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const user = req.user;

  if (user?.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden: Admins only' });
  }

  // Destructure body
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  // Build update object dynamically
  const updateData: Record<string, any> = {};

  if (vehicle_name !== undefined) updateData.vehicle_name = vehicle_name;
  if (type !== undefined) updateData.type = type;
  if (registration_number !== undefined)
    updateData.registration_number = registration_number;
  if (daily_rent_price !== undefined)
    updateData.daily_rent_price = daily_rent_price;
  if (availability_status !== undefined)
    updateData.availability_status = availability_status;

  // Nothing to update
  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({
      success: false,
      message: 'At least one field must be provided to update',
    });
  }

  try {
    const updatedVehicle = await vehicleService.updateVehicleById(
      vehicleId as string,
      updateData
    );

    if (!updatedVehicle) {
      return res.status(404).send({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle,
    });
  } catch (error) {
    res.status(500).send({ message: 'Error updating vehicle', error });
  }
};

export const vehicleControllers = {
  createVehicle,
  getVehicles,
  getVehiclesById,
  deleteVehicle,
  updateVehiclesById,
};
