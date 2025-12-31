// Load database configuration for Neon (serverless PostgreSQL)
const { Pool } = require("pg");

let dbConfig = {
  connectionString:
    "postgresql://neondb_owner:npg_df4uKGpYlyB2@ep-plain-dawn-a43f24zx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false, // Required for Neon's self-signed cert in many Node.js setups
  },
};

const pool = new Pool(dbConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};
