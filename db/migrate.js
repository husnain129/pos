const db = require('./config');
const fs = require('fs');
const path = require('path');

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Read and execute the migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrate_users.sql'),
      'utf8'
    );
    
    await db.query(migrationSQL);
    
    console.log('Migration completed successfully!');
    console.log('Default admin user credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();

