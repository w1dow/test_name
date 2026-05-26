import { rankEmailsWithCoral } from "../services/coral.service.js";

export const testEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const result = await rankEmailsWithCoral(email);

    res.json({
      email,
      coralResult: result,
      status: "ok"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};