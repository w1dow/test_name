import { google } from "googleapis";

export async function getGmailEmails({ accessToken }) {
  if (!accessToken) {
    throw new Error("Missing accessToken");
  }

  // Create auth client using token from OAuth
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  // Step 1: get message list
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5
  });

  const messages = res.data.messages || [];

  // Step 2: fetch full email data
  const emails = await Promise.all(
    messages.map(async (msg) => {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id
      });

      const headers = full.data.payload.headers || [];

      const getHeader = (name) =>
        headers.find(h => h.name === name)?.value || "";

      return {
        id: msg.id,
        from: getHeader("From"),
        subject: getHeader("Subject"),
        snippet: full.data.snippet,
        receivedAt: full.data.internalDate
      };
    })
  );

  return emails;
}