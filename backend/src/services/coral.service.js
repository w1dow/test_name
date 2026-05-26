import { getGmailEmails } from "./gmail.service.js";

export async function runCoralGmail({ accessToken, userId }) {
  const emails = await getGmailEmails({ accessToken });

  return {
    source: "coral-gmail",
    userId,
    count: emails.length,
    emails
  };
}