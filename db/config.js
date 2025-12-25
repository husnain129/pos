const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

// Load environment variables
require("dotenv").config();

// Get database configuration file path based on environment
function getDbConfigPath() {
  const isDev = process.env.NODE_ENV === "dev";

  if (isDev) {
    // Development - use .env file in project root
    return null; // Will use process.env.DATABASE_URL
  }

  // Production - use config file in user data directory
  let configDir;
  if (process.platform === "darwin") {
    configDir = path.join(
      process.env.HOME,
      "Library",
      "Application Support",
      "Creative Hands POS"
    );
  } else if (process.platform === "win32") {
    configDir = path.join(process.env.APPDATA, "Creative Hands POS");
  } else {
    configDir = path.join(process.env.HOME, ".creative-hands-pos");
  }

  // Create config directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configFile = path.join(configDir, "database.json");

  // Create default config if it doesn't exist
  if (!fs.existsSync(configFile)) {
    const defaultConfig = {
      host: "localhost",
      port: 5432,
      database: "pos",
      user: "postgres",
      password: "admin",
    };
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    console.log("Created default database config at:", configFile);
  }

  return configFile;
}

// Load database configuration
let dbConfig;
const configPath = getDbConfigPath();

if (configPath) {
  // Production - load from config file
  const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
  dbConfig = configData;
  console.log("Using database config from:", configPath);
} else {
  // Development - use environment variables or defaults
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "pos",
    user: process.env.DB_USER || "muhammadh.",
    password: process.env.DB_PASSWORD || "",
  };
  console.log("Using database config from .env");
}

const pool = new Pool(dbConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};
