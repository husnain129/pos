-- Migration: Add image and image_link columns to products table
-- Run this if you get "column p.image does not exist" error

-- Add image column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='products' AND column_name='image'
    ) THEN
        ALTER TABLE products ADD COLUMN image VARCHAR(255);
    END IF;
END $$;

-- Add image_link column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='products' AND column_name='image_link'
    ) THEN
        ALTER TABLE products ADD COLUMN image_link TEXT;
    END IF;
END $$;
