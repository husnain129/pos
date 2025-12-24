-- Reset and Import Data Script
-- This will delete ALL data from the database including transactions
-- WARNING: This will remove all transaction history and reset everything except users

BEGIN;

-- Delete all data (in correct order due to foreign key constraints)
DELETE FROM transactions;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM institutes;
DELETE FROM customers;

-- Reset sequences
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE institutes_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE customers_id_seq RESTART WITH 1;

-- Insert Institutes
INSERT INTO institutes (name, district, zone) VALUES
('GVTI(W) Sahiwal', 'Sahiwal', 'Center'),
('GVTI W JAND', 'Attock', 'North'),
('GTTI Bahawalpur', 'Bahawalpur', 'South'),
('GVTI (W) CCI', 'Sahiwal', 'Center'),
('GTTI Vehari', 'Khanewal/Vehari', 'South'),
('GOVT. TECHNICAL TRAINING INSTITUTE SADIQABAD', 'Rahim Yar Khan', 'South'),
('GVTIW Bahawalpur', 'Bahawalpur', 'South');

-- Insert Categories with Institute references
INSERT INTO categories (name, institute_id) VALUES
('Textile Design', (SELECT id FROM institutes WHERE name = 'GVTI(W) Sahiwal')),
('Customization & Embellishment on outfit and decore', (SELECT id FROM institutes WHERE name = 'GVTI W JAND')),
('Art & Craft', (SELECT id FROM institutes WHERE name = 'GVTI(W) Sahiwal')),
('Hospitality', (SELECT id FROM institutes WHERE name = 'GTTI Bahawalpur')),
('Hand Made Products', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),
('Electronics', (SELECT id FROM institutes WHERE name = 'GTTI Vehari')),
('Refrigeration and Air Conditioning', (SELECT id FROM institutes WHERE name = 'GOVT. TECHNICAL TRAINING INSTITUTE SADIQABAD')),
('Fabric Printing', (SELECT id FROM institutes WHERE name = 'GVTIW Bahawalpur'));

-- Insert Products
INSERT INTO products (zone, district, institute_name, product_category, product_name, product_specifications, quantity, price, image_link, institute_id) VALUES
-- 1. Canvas Painting
('Center', 'Sahiwal', 'GVTI(W) Sahiwal', 'Textile Design', 'Canvas Painting', 'Plastic Pares & Oil Paint', 5, 2300, 'https://drive.google.com/drive/folders/1yYEKK3G0woqRU9NswuyWNm8x1YwnpWS5?usp=sharing', (SELECT id FROM institutes WHERE name = 'GVTI(W) Sahiwal')),

-- 2. Hand Made Different Products
('North', 'Attock', 'GVTI W JAND', 'Customization & Embellishment on outfit and decore', 'Hand Made Different Products', 'key chain, Nikah pen, Happy birthday name plate', 15, 2000, 'https://docs.google.com/presentation/d/1eQ8-RtuX6rxDX3E84onM4Gp7AnyN-Wga/edit?usp=drive_link&ouid=101278120064170247186&rtpof=true&sd=true', (SELECT id FROM institutes WHERE name = 'GVTI W JAND')),

-- 3. Hand Made Bag
('Center', 'Sahiwal', 'GVTI(W) Sahiwal', 'Art & Craft', 'Hand Made Bag', 'Wiving with embellishment', 2, 1500, 'https://drive.google.com/drive/folders/1u95hZdS1haHR8QvWJglqM2ZS8LNRcPr2?usp=sharing', (SELECT id FROM institutes WHERE name = 'GVTI(W) Sahiwal')),

-- 4. Crafted Coca
('South', 'Bahawalpur', 'GTTI Bahawalpur', 'Hospitality', 'Crafted Coca', 'The dehydrated fruits and fruit puree honey cinnamon filled chocolates', 0, 187, 'https://drive.google.com/drive/folders/1n6FP2Cjo5JjlblFkYvINvI_3fGsuW2Go?usp=sharing', (SELECT id FROM institutes WHERE name = 'GTTI Bahawalpur')),

-- 5. Shawl
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Shawl', 'Hand Made Product', 62, 6000, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5b. Lady Dress
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Ladies Dress', 'Hand Made Product', 62, 2500, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5c. Bags/Purse
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Purse', 'Hand Made Product', 62, 6000, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5d. Small Purse
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Small Purse', 'Hand Made Product', 62, 3000, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5e. Canvas
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Canvas', 'Hand Made Product', 62, 1500, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5f. Cushion
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Cushion', 'Hand Made Product', 62, 1500, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5g. Sofa Back
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Sofa Back', 'Hand Made Product', 62, 1500, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5h. Kids Frock
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Kids Frock', 'Hand Made Product', 62, 1000, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5i. Kids Lehnga
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Kids Lehnga', 'Hand Made Product', 62, 1500, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 5j. Decoration Piece
('Center', 'Sahiwal', 'GVTI (W) CCI', 'Hand Made Products', 'Decoration Piece', 'Hand Made Product', 62, 3000, 'https://drive.google.com/file/d/1tusEI3sxfbe-Uz4jxjYKx81FYmkTjEeB/view?usp=drive_link', (SELECT id FROM institutes WHERE name = 'GVTI (W) CCI')),

-- 6. LED Lights
('South', 'Khanewal/Vehari', 'GTTI Vehari', 'Electronics', 'LED Lights', '12 W, 18 W, 24 W', 1000, 80, 'https://drive.google.com/drive/folders/1Sz2N1XOgCCkaGAQrI5_9zJhm_snr9YNV', (SELECT id FROM institutes WHERE name = 'GTTI Vehari')),

-- 7. DC Water Cooler
('South', 'Rahim Yar Khan', 'GOVT. TECHNICAL TRAINING INSTITUTE SADIQABAD', 'Refrigeration and Air Conditioning', 'DC WATER COOLER', 'DC WATER COOLER 12 VOLT', 1, 25000, 'https://drive.google.com/drive/folders/1tDWtGUELl8PhyjnJY8rrNiodZJ3rMX7H?role=writer', (SELECT id FROM institutes WHERE name = 'GOVT. TECHNICAL TRAINING INSTITUTE SADIQABAD')),

-- 8. Eco Bloom Printing
('South', 'Bahawalpur', 'GVTIW Bahawalpur', 'Fabric Printing', 'Eco Bloom Printing', 'Eco Bloom printing uses natural flowers Leaves and Plant Material', 7, 650, 'https://drive.google.com/drive/folders/1Da1fMfZBx5e1WvaSYHNduuN8X2me_GuX?usp=sharing', (SELECT id FROM institutes WHERE name = 'GVTIW Bahawalpur'));

COMMIT;
