import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Chatbot API running 🚀" });
});

export default app;