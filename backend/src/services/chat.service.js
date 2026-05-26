import axios from "axios";
import {config} from "../config/config.js";

export const getChatResponse = async (message) => {
    try {
        const response = await axios.post(`${config.ollamaUrl}/api/generate`, {
            model: config.model,
            prompt: `Answer in ONE short line only.\nUser: ${message}\nAI:`,
            stream: false
        });

        let text = response.data.response;

        return text
            .replace(/\n/g, " ")
            .trim()
            .split(".")[0];

    } catch (err) {
        console.log("Service error:", err.message);
        return "AI not available";
    }
};