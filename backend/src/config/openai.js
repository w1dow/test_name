import OpenAI from "openai";
import config from "./config.js";

const client = new OpenAI({
    apiKey: config.openaiKey,
});

export default client;