import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "db",
  user: "chatbot",
  password: "chatbot123",
  database: "chatbot_db",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;