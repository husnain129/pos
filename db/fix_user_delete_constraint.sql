-- Migration to fix foreign key constraint on transactions.user_id
-- This allows deleting users by setting user_id to NULL in related transactions

-- Drop the existing foreign key constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;

-- Add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE transactions ADD CONSTRAINT transactions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;