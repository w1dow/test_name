import db from "../config/db.js";

export const createUser = async (req, res) => {
  try {
    const { email, name } = req.body;

    const [result] = await db.query(
      "INSERT INTO users (email, name) VALUES (?, ?)",
      [email, name]
    );

    res.json({
      success: true,
      userId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    );

    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};