import express, { Request, Response } from 'express';
import config from './config';
import initDb from './config/db';
import { authRoutes } from './modules/auth/authRoutes';
import { userRoutes } from './modules/user/userRoutes';

const app = express();
const PORT = config.port || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('App is running');
});

// Database Initialization.
initDb();

app.use(express.json());

app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
