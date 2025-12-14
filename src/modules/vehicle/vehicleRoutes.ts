import express from 'express';
import authMiddleware from '../../middleware/auth';
import { vehicleControllers } from './vehicleController';

const router = express.Router();

router.post('/vehicles', authMiddleware, vehicleControllers.createVehicle);
router.get('/vehicles', vehicleControllers.getVehicles);
router.get('/vehicles/:vehicleId', vehicleControllers.getVehiclesById);
router.put(
  '/vehicles/:vehicleId',
  authMiddleware,
  vehicleControllers.updateVehiclesById
);
router.delete(
  '/vehicles/:vehicleId',
  authMiddleware,
  vehicleControllers.deleteVehicle
);

export const vehicleRoutes = router;
