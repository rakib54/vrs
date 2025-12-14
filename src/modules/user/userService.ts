import { pool } from '../../config/db';

const getUsers = async () => {
  const users = await pool.query(`SELECT * FROM users`);

  users.rows = users.rows.map(({ password, ...rest }) => {
    return rest;
  });

  return users;
};

const updateUsers = async (userId: string, userData: Object) => {
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);

  if (user.rows.length === 0) {
    throw new Error('User not found');
  }
  const userFieldsKeys = Object.keys(userData);

  const setClause = userFieldsKeys
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');

  const userFieldValues = Object.values(userData);

  const updateQuery = `
    UPDATE users
    SET ${setClause}
    WHERE id = $${userFieldsKeys.length + 1}
    RETURNING *
  `;

  const updatedUser = await pool.query(updateQuery, [
    ...userFieldValues,
    userId,
  ]);

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
