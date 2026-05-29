const db = require("./db.service");

const createUser = async (email, name) => {
  const result = await db.query(
    "INSERT INTO users (email, name) VALUES (?, ?)",
    [email, name]
  );

  return result;
};

const getUsers = async () => {
  return await db.query("SELECT * FROM users");
};

const getUserById = async (id) => {
  const rows = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
};