import { getChatResponse } from "../services/chat.service.js";

export const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "message required" });
        }

        const reply = await getChatResponse(message);

        res.json({ reply });

    } catch (err) {
        console.log("Controller error:", err.message);
        res.status(500).json({ error: "server error" });
    }
};