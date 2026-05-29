import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", message: "DB connected 🚀" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;