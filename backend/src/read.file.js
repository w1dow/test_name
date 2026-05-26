import fs from "fs";
import path from "path";

const filePath = path.resolve("src/data/test_notes.txt");

const content = fs.readFileSync(filePath, "utf-8");

console.log("📄 FILE CONTENT START");
console.log(content);
console.log("📄 FILE CONTENT END");