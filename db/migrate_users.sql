-- Migration script to add missing columns to users table
-- Run this if your users table is missing the permission columns

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add fullname column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='fullname') THEN
        ALTER TABLE users ADD COLUMN fullname VARCHAR(255);
    END IF;
    
    -- Add permission columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='perm_products') THEN
        ALTER TABLE users ADD COLUMN perm_products INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='perm_categories') THEN
        ALTER TABLE users ADD COLUMN perm_categories INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='perm_transactions') THEN
        ALTER TABLE users ADD COLUMN perm_transactions INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='perm_users') THEN
        ALTER TABLE users ADD COLUMN perm_users INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='perm_settings') THEN
        ALTER TABLE users ADD COLUMN perm_settings INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create default admin user if it doesn't exist
-- Password is base64 encoded "admin" = "YWRtaW4="
INSERT INTO users (id, username, password, fullname, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status, role)
VALUES (1, 'admin', 'YWRtaW4=', 'Administrator', 1, 1, 1, 1, 1, '', 'admin')
ON CONFLICT (id) DO UPDATE 
SET 
    username = 'admin',
    password = 'YWRtaW4=',
    fullname = COALESCE(users.fullname, 'Administrator'),
    perm_products = COALESCE(users.perm_products, 1),
    perm_categories = COALESCE(users.perm_categories, 1),
    perm_transactions = COALESCE(users.perm_transactions, 1),
    perm_users = COALESCE(users.perm_users, 1),
    perm_settings = COALESCE(users.perm_settings, 1),
    role = COALESCE(users.role, 'admin');

-- Also update by username in case id conflict doesn't work
INSERT INTO users (username, password, fullname, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status, role)
VALUES ('admin', 'YWRtaW4=', 'Administrator', 1, 1, 1, 1, 1, '', 'admin')
ON CONFLICT (username) DO UPDATE 
SET 
    password = 'YWRtaW4=',
    fullname = COALESCE(users.fullname, 'Administrator'),
    perm_products = COALESCE(users.perm_products, 1),
    perm_categories = COALESCE(users.perm_categories, 1),
    perm_transactions = COALESCE(users.perm_transactions, 1),
    perm_users = COALESCE(users.perm_users, 1),
    perm_settings = COALESCE(users.perm_settings, 1),
    role = COALESCE(users.role, 'admin');

