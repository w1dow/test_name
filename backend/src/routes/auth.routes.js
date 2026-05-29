import express from "express";
import { getAuthUrl, getToken } from "../services/googleauth.service.js";

const router = express.Router();

// Step 1: redirect to Google login
router.get("/google", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// Step 2: callback from Google
router.get("/google/callback", async (req, res) => {
  console.log("CALLBACK HIT:", req.query);
  try {
    const code = req.query.code;

    const tokens = await getToken(code);

    res.json({
      access_token: tokens.access_token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;