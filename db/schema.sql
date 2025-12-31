-- Create tables for Creative Hands POS system

-- Drop existing tables if recreating (uncomment if needed)
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS inventory CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS institutes CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS settings CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    fullname VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(50),
    status VARCHAR(100),
    perm_products INTEGER DEFAULT 0,
    perm_categories INTEGER DEFAULT 0,
    perm_transactions INTEGER DEFAULT 0,
    perm_users INTEGER DEFAULT 0,
    perm_settings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Institutes table
CREATE TABLE IF NOT EXISTS institutes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(255),
    zone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (linked to institutes)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    institute_id INTEGER REFERENCES institutes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (with institute relationship and cost tracking)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    zone VARCHAR(100),
    district VARCHAR(255),
    institute_name VARCHAR(255),
    institute_id INTEGER REFERENCES institutes(id) ON DELETE CASCADE,
    product_category VARCHAR(255),
    product_name VARCHAR(255) NOT NULL,
    product_specifications TEXT,
    product_code VARCHAR(100) UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    description TEXT,
    barcode VARCHAR(255),
    alert_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legacy inventory table (maps to products for backward compatibility)
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100) UNIQUE,
    category_id INTEGER REFERENCES categories(id),
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    quantity INTEGER DEFAULT 0,
    description TEXT,
    barcode VARCHAR(255),
    alert_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    ref_number VARCHAR(100),
    customer_id INTEGER REFERENCES customers(id),
    customer_name VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    status INTEGER DEFAULT 1,
    items JSONB,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(255),
    store_address TEXT,
    store_phone VARCHAR(50),
    store_email VARCHAR(255),
    currency VARCHAR(10),
    tax_rate DECIMAL(5, 2),
    charge_tax BOOLEAN DEFAULT false,
    percentage DECIMAL(5, 2),
    symbol VARCHAR(10),
    receipt_header TEXT,
    receipt_footer TEXT,
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default admin user
INSERT INTO users (username, password, name, fullname, role, status, perm_products, perm_categories, perm_transactions, perm_users, perm_settings)
VALUES ('admin', 'admin', 'Administrator', 'System Administrator', 'admin', 'active', 1, 1, 1, 1, 1)
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO settings (id, store_name, currency, tax_rate, symbol, charge_tax) 
VALUES (1, 'Creative Hands By TEVTA', 'PKR', 0.00, 'Rs', false)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_institute ON products(institute_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_code ON inventory(product_code);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_institute ON categories(institute_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ref ON transactions(ref_number);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
