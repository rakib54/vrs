import { pool } from '../../config/db';

const getUsers = async () => {
  const users = await pool.query(`SELECT * FROM users`);

  return users;
};

const updateUsers = async (userId: string, userData: Object) => {
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

  if (user.rows.length === 0) {
    throw new Error('User not found');
  }
  const userFields = Object.keys(userData);

  const setClause = userFields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');

  const values = Object.values(userData);

  const updateQuery = `
    UPDATE users
    SET ${setClause}
    WHERE id = $${userFields.length + 1}
    RETURNING *
  `;

  const updatedUser = await pool.query(updateQuery, [...values, userId]);

  return updatedUser.rows[0];
};

const deleteUser = async (userId: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

  if (user.rows.length === 0) {
    throw new Error('User not found');
  }

  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
};

export const userService = {
  getUsers,
  updateUsers,
  deleteUser,
};
