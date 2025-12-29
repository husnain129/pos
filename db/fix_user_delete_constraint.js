const db = require('./config');
const fs = require('fs');
const path = require('path');

async function migrateUserDeleteConstraint() {
  try {
    console.log('Starting user delete constraint migration...');

    // Read and execute the migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'fix_user_delete_constraint.sql'),
      'utf8'
    );

    await db.query(migrationSQL);

    console.log('Migration completed successfully!');
    console.log('Users can now be deleted - related transactions will have user_id set to NULL.');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrateUserDeleteConstraint();