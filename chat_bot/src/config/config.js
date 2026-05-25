import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  ollamaUrl: process.env.OLLAMA_URL || "http://host.docker.internal:11434",
  model: process.env.MODEL || "llama3"
};