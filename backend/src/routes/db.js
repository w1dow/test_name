const express = require("express");
const router = express.Router();
const db = require("../db");

// Save token
router.post("/save", async (req, res) => {
  const { user_id, service, access_token, refresh_token } = req.body;

  try {
    await db.query(
      `INSERT INTO user_integrations (user_id, service, access_token, refresh_token)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       access_token = VALUES(access_token),
       refresh_token = VALUES(refresh_token)`,
      [user_id, service, access_token, refresh_token]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tokens
router.get("/:user_id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT service, access_token, refresh_token
       FROM user_integrations
       WHERE user_id = ?`,
      [req.params.user_id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete token
router.delete("/:user_id/:service", async (req, res) => {
  try {
    await db.query(
      `DELETE FROM user_integrations WHERE user_id = ? AND service = ?`,
      [req.params.user_id, req.params.service]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;