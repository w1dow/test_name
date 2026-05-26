import { getChatResponse } from '../services/chat_service.js';

export const handleChat = async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: "message required" });
        }

        const reply = await getChatResponse(message);

        res.json({ reply });

    } catch (err) {
    console.log("CHAT ERROR:", err);
    res.status(500).json({ error: err.message });
}
};