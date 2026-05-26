export async function getMockEmails({ accessToken, userId }) {
  // NOTE: accessToken is NOT used yet
  // but we keep it to match real implementation later

  return [
    {
      id: "g1",
      from: "friend@gmail.com",
      subject: "I am in hospital",
      snippet: "Hey, I had an accident and I'm admitted...",
      receivedAt: "2026-05-26T07:30:00Z",
      unread: true
    },
    {
      id: "g2",
      from: "recruiter@company.com",
      subject: "Interview update",
      snippet: "We want to schedule your next round...",
      receivedAt: "2026-05-26T08:00:00Z",
      unread: true
    },
    {
      id: "g3",
      from: "college@uni.edu",
      subject: "Assignment due tomorrow",
      snippet: "Submit before 11:59 PM",
      receivedAt: "2026-05-25T22:00:00Z",
      unread: true
    }
  ];
}