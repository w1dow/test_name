import express from "express";
import { runCoralGmail } from "../services/coral.service.js";
import { getGmailEmails } from "../services/gmail.service.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const emails = await getGmailEmails({
      accessToken: process.env.DEMO_ACCESS_TOKEN
    });

    res.json({
      source: "coral-test",
      demo: true,
      count: emails.length,
      emails
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


router.post("/gmail", async (req, res) => {
  try {
    const { access_token, userId } = req.body;

    const result = await runCoralGmail({
      accessToken: access_token,
      userId
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;