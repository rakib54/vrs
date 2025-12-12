import express, { Request, Response } from 'express';
import initDb from '../config/db';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('App is running');
});

// Database Initialization.
initDb();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
