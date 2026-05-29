import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import coralRoutes from "./routes/coral.routes.js";
import briefRoutes from "./routes/brief.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dbRoutes from "./routes/db.routes.js";
const app = express();

app.use(cors());
app.use(express.json());



// routes
app.use("/users", userRoutes);
app.use("/db", dbRoutes);


app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/coral", coralRoutes);
app.use("/api/brief", briefRoutes);


app.get("/", (req, res) => {
    res.json({ message: "Chatbot API running 🚀" });
});

export default app;