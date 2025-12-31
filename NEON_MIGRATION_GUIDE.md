# Neon Database Migration Guide - Remove Product Images

This guide explains how to apply the database changes to remove product image columns from your Neon PostgreSQL database.

## Overview

We've removed product image functionality from the POS system, including:
- Removed `image` and `image_link` columns from the `products` table
- Removed `image` column from the `inventory` table
- Updated all backend APIs and frontend UI

## Step 1: Backup Your Data (IMPORTANT!)

Before making any changes, **backup your database**:

1. Go to your [Neon Console](https://console.neon.tech/)
2. Select your project
3. Navigate to your database
4. Use the SQL Editor to export important data:

```sql
-- Export products data
COPY products TO '/tmp/products_backup.csv' CSV HEADER;

-- Or create a full backup of just product data
SELECT * FROM products;
```

Save this data locally in case you need to restore it.

## Step 2: Apply Migration to Neon Database

### Option A: Using Neon Console (Recommended)

1. Go to https://console.neon.tech/
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Copy and paste the following migration script:

```sql
-- Migration: Remove image and image_link columns from products and inventory tables
-- This migration removes all product image functionality

-- Remove image columns from products table
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='products' AND column_name='image'
    ) THEN
        ALTER TABLE products DROP COLUMN image;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='products' AND column_name='image_link'
    ) THEN
        ALTER TABLE products DROP COLUMN image_link;
    END IF;
END $$;

-- Remove image column from inventory table (legacy compatibility table)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='inventory' AND column_name='image'
    ) THEN
        ALTER TABLE inventory DROP COLUMN image;
    END IF;
END $$;
```

5. Click **Run** to execute the migration
6. You should see success messages for each operation

### Option B: Using psql Command Line

If you prefer using the command line:

1. Get your Neon connection string from the console
2. Run the migration file:

```bash
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" -f db/remove_image_columns.sql
```

Replace the connection string with your actual Neon connection string.

### Option C: Using Node.js Script

Create a migration script (`migrate-neon.js`):

```javascript
const { Client } = require('pg');

const client = new Client({
  connectionString: 'YOUR_NEON_CONNECTION_STRING',
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to Neon database');

    // Remove image from products
    await client.query(`
      DO $$ 
      BEGIN
          IF EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='products' AND column_name='image'
          ) THEN
              ALTER TABLE products DROP COLUMN image;
          END IF;
      END $$;
    `);
    console.log('✓ Removed image column from products');

    // Remove image_link from products
    await client.query(`
      DO $$ 
      BEGIN
          IF EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='products' AND column_name='image_link'
          ) THEN
              ALTER TABLE products DROP COLUMN image_link;
          END IF;
      END $$;
    `);
    console.log('✓ Removed image_link column from products');

    // Remove image from inventory
    await client.query(`
      DO $$ 
      BEGIN
          IF EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='inventory' AND column_name='image'
          ) THEN
              ALTER TABLE inventory DROP COLUMN image;
          END IF;
      END $$;
    `);
    console.log('✓ Removed image column from inventory');

    console.log('\n✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
```

Run it:
```bash
node migrate-neon.js
```

## Step 3: Verify Migration

After applying the migration, verify the changes:

```sql
-- Check products table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Check inventory table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inventory' 
ORDER BY ordinal_position;

-- Verify no image columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name IN ('products', 'inventory') 
  AND column_name LIKE '%image%';
```

You should see **no results** from the last query if the migration was successful.

## Step 4: Test Your Application

1. Restart your POS application
2. Test adding a new product (no image fields should appear)
3. Test editing an existing product
4. Test viewing the product list (should display without image column)
5. Test POS functionality to ensure products still work correctly

## Step 5: Update Future Schema Deployments

If you ever need to recreate your database from scratch, use the updated `db/schema.sql` file which no longer includes image columns.

## Rollback (If Needed)

If you need to rollback the changes:

```sql
-- Add image columns back to products
ALTER TABLE products ADD COLUMN image VARCHAR(255);
ALTER TABLE products ADD COLUMN image_link TEXT;

-- Add image column back to inventory
ALTER TABLE inventory ADD COLUMN image VARCHAR(255);
```

**Note**: This will only recreate the columns - any old image data will be lost unless you restore from backup.

## Files Changed in This Update

### Database:
- ✅ `db/schema.sql` - Updated to remove image columns
- ✅ `db/remove_image_columns.sql` - New migration file

### Backend:
- ✅ `api/inventory.js` - Removed image upload handling and queries

### Frontend:
- ✅ `index.html` - Removed image upload UI from product modal
- ✅ `assets/js/pos.js` - Removed image display and handling code

## Benefits of This Change

✅ **Simplified UI** - Cleaner, more modern product interface  
✅ **Faster Performance** - No image processing overhead  
✅ **Reduced Storage** - No image files to manage  
✅ **Better Focus** - Focus on product data that matters  
✅ **Easier Maintenance** - Less code to maintain  

## Support

If you encounter any issues:
1. Check the Neon console logs
2. Verify your connection string is correct
3. Ensure you have proper permissions
4. Contact support with the error message

## Questions?

- What is Neon? - A serverless PostgreSQL platform
- Will this affect my existing products? - No, only the image columns are removed
- Can I still use product codes/IDs? - Yes, all other data remains intact
- Do I need to restart my app? - Yes, restart after migration

---

**Migration completed on**: December 31, 2025  
**Database**: Neon PostgreSQL  
**Application**: Creative Hands POS System
