-- Migration: Remove image and image_link columns from products and inventory tables
-- This migration removes all product image functionality
-- Run this in your Neon database console or via psql

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

-- Verification query - Run this after migration to confirm removal
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name IN ('products', 'inventory') 
-- ORDER BY table_name, ordinal_position;
