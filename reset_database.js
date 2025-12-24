const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Database configuration
const dbConfig = require("./db/config");

const pool = new Pool(dbConfig);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n==========================================");
console.log("   DATABASE RESET UTILITY");
console.log("   Creative Hands POS System");
console.log("==========================================\n");

console.log("⚠️  WARNING: This will delete ALL data including:");
console.log("   - All transactions and sales history");
console.log("   - All products and inventory");
console.log("   - All categories");
console.log("   - All institutes");
console.log("   - All customers");
console.log("   - All settings\n");
console.log("✓  User accounts will be PRESERVED\n");

rl.question(
  "Are you sure you want to reset the database? (yes/no): ",
  (answer) => {
    if (answer.toLowerCase() === "yes") {
      resetDatabase();
    } else {
      console.log("\n❌ Database reset cancelled.\n");
      rl.close();
      process.exit(0);
    }
  }
);

async function resetDatabase() {
  const client = await pool.connect();

  try {
    console.log("\n🔄 Starting database reset...\n");

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "db", "reset_and_import_data.sql");
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    // Execute the SQL
    await client.query(sqlContent);

    console.log("✅ Database reset completed successfully!\n");
    console.log("Summary:");
    console.log("  ✓ All transactions deleted");
    console.log("  ✓ All products deleted");
    console.log("  ✓ All categories deleted");
    console.log("  ✓ All institutes deleted");
    console.log("  ✓ All customers deleted");
    console.log("  ✓ Sample data imported");
    console.log("  ✓ ID sequences reset\n");
    console.log("You can now restart the application.\n");
  } catch (error) {
    console.error("\n❌ Error resetting database:", error.message);
    console.error("\nPlease check:");
    console.error("  - Database connection settings in db/config.js");
    console.error("  - Database server is running");
    console.error("  - You have sufficient permissions\n");
    process.exit(1);
  } finally {
    client.release();
    pool.end();
    rl.close();
  }
}
