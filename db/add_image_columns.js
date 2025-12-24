const fs = require('fs');
const path = require('path');
const db = require('./config');

async function addImageColumns() {
  console.log('Adding image columns to products table...\n');

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'add_image_columns.sql'), 'utf8');
    
    await db.query(sql);
    
    console.log('✓ Successfully added image and image_link columns to products table');
    console.log('\nMigration completed successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error adding columns:', err.message);
    process.exit(1);
  }
}

addImageColumns();
