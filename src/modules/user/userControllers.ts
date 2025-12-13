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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { ...userData } = req.body;

    const user = req?.user as JwtPayload;

    // Need to update this customer himself or admin only
    if (user.id !== userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access is denied' });
    }

    const updatedUserInfo = await userService.updateUsers(
      userId as string,
      userData
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUserInfo,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user', errorDetails: error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = req?.user as JwtPayload;

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access is denied' });
    }

    await userService.deleteUser(userId as string);

    res.status(200).json({
      success: true,
      message: `User with ID ${userId} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user', errorDetails: error });
  }
};

export const userControllers = {
  getUsers,
  updateUser,
  deleteUser,
};
