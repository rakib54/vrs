import express, { Request, Response } from 'express';
import initDb from './config/db';
import { authRoutes } from './modules/auth/authRoutes';
import { bookingRouter } from './modules/booking/bookingRoutes';
import { userRoutes } from './modules/user/userRoutes';
import { vehicleRoutes } from './modules/vehicle/vehicleRoutes';

const app = express();
// const PORT = config.port || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('App is running');
});

// Database Initialization.
initDb();

app.use(express.json());

app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', vehicleRoutes);
app.use('/api/v1', bookingRouter);

export default app;
