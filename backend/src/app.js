import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import coralRoutes from "./routes/coral.routes.js";
import briefRoutes from "./routes/brief.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(cors());
app.use(express.json());



// routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/coral", coralRoutes);
app.use("/api/brief", briefRoutes);
app.get("/test/emails", (req, res) => {
  res.json([
    {
      from: "recruiter@company.com",
      subject: "Interview update",
      unread: true
    },
    {
      from: "teacher@college.edu",
      subject: "Assignment due tomorrow",
      unread: true
    }
  ]);
});

app.get("/", (req, res) => {
    res.json({ message: "Chatbot API running 🚀" });
});

export default app;