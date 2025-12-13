import { Request, Response } from 'express';
import { authService } from './authService';

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await authService.createUser(
      name,
      email,
      password,
      phone,
      role
    );

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', errorDetails: error });
  }
};

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.userLogin(email, password);

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

export const authControllers = {
  createUser,
  userLogin,
};
