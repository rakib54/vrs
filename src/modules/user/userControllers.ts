import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { userService } from './userService';

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    const user = req?.user as JwtPayload;

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access is denied' });
    }

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      user: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', errorDetails: error });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, phone } = req.body;

    const user = await userService.updateUsers(userId as string, name, email);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: user.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user', errorDetails: error });
  }
};

export const userControllers = {
  getUsers,
  updateUsers,
};
