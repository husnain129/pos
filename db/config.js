const { Pool } = require("pg");

// Load database configuration
let dbConfig = {
  host: "localhost",
  port: 5432,
  database: "pos",
  user: "muhammadh.",
  password: "",
};
const pool = new Pool(dbConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};
