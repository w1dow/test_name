import fs from "fs";
import path from "path";

const filePath = path.resolve("src/data/drone_specs.txt");

const documentText = fs.readFileSync(filePath, "utf-8");

console.log("📄 Drone dataset loaded:", documentText.length);

export const getDocument = () => documentText;
