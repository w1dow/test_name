import { getMockEmails } from "../services/gmail.service.dummy.js";
import { runCoralGmail } from "../services/coral.service.js";

export const getMorningBrief = async (req, res) => {
  try {
    const emails = getMockEmails();

    const rankedEmails = runCoralGmail(emails);

    const top3 = rankedEmails.slice(0, 3).map((e, idx) => ({
      rank: idx + 1,
      from: e.from,
      subject: e.subject,
      score: e.score
    }));

    res.json({
      status: "ok",
      date: new Date().toISOString(),
      top3
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};