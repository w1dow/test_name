const db = require("../config/db.js");

const query = async (sql, params = []) => {
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports = { query };