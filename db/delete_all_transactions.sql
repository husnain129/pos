-- Delete All Transactions
-- WARNING: This will permanently delete all transaction records from the database
-- Make sure to backup your database before running this script

-- Delete all transactions
DELETE FROM transactions;

-- Reset the auto-increment sequence to start from 1
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;

-- Display confirmation
SELECT 'All transactions have been deleted and ID sequence has been reset' AS status;
