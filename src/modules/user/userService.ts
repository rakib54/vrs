import { pool } from '../../config/db';

const getUsers = async () => {
  const users = await pool.query(`SELECT * FROM users`);

  return users;
};

const updateUsers = async (userId: string, name: string, email: string) => {
  const updatedUser = await pool.query(
    `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
    [name, email, userId]
  );

  return updatedUser;
};

export const userService = {
  getUsers,
  updateUsers,
};
