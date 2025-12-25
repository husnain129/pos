-- Add role-based authentication setup
-- This script sets up roles and creates a default administrator

-- Update existing users without role to have 'administrator' role
UPDATE users SET role = 'administrator' WHERE role IS NULL OR role = '' OR role = 'user';

-- Insert default administrator if no users exist
INSERT INTO users (username, password, fullname, role, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status)
SELECT 'admin', 'admin', 'Administrator', 'administrator', 1, 1, 1, 1, 1, ''
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Sample cashier user (password: cashier123)
-- Note: Password is base64 encoded 'Y2FzaGllcjEyMw=='
INSERT INTO users (username, password, fullname, role, perm_products, perm_categories, perm_transactions, perm_users, perm_settings, status)
SELECT 'cashier', 'Y2FzaGllcjEyMw==', 'Sample Cashier', 'cashier', 0, 0, 1, 0, 0, ''
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'cashier');
