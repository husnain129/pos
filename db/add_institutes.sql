-- Create institutes table
CREATE TABLE IF NOT EXISTS institutes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(255),
    zone VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add institute_id column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS institute_id INTEGER REFERENCES institutes(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_institute ON categories(institute_id);
