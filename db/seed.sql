-- Seed Data for Creative Hands POS System
-- Comprehensive product catalog from TEVTA institutes

-- =====================================================
-- CLEAR EXISTING DATA (in correct order for foreign keys)
-- =====================================================
DELETE FROM transactions WHERE id > 0;
DELETE FROM products WHERE id > 0;
DELETE FROM inventory WHERE id > 0;
DELETE FROM categories WHERE id > 0;
DELETE FROM institutes WHERE id > 0;
DELETE FROM customers WHERE id > 0;
DELETE FROM users WHERE username != 'admin';

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 2;
ALTER SEQUENCE institutes_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE inventory_id_seq RESTART WITH 1;
ALTER SEQUENCE customers_id_seq RESTART WITH 1;
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;

-- =====================================================
-- USERS
-- =====================================================
INSERT INTO users (username, password, name, fullname, email, role, status, perm_products, perm_categories, perm_transactions, perm_users, perm_settings)
VALUES 
    ('manager1', 'manager123', 'Manager', 'Store Manager', 'manager@creativehands.pk', 'manager', 'active', 1, 1, 1, 0, 1),
    ('cashier1', 'cashier123', 'Cashier', 'Ali Ahmed', 'ali@creativehands.pk', 'cashier', 'active', 1, 0, 1, 0, 0),
    ('cashier2', 'cashier123', 'Cashier', 'Fatima Khan', 'fatima@creativehands.pk', 'cashier', 'active', 1, 0, 1, 0, 0),
    ('inventory1', 'inv123', 'Inventory', 'Hassan Raza', 'hassan@creativehands.pk', 'staff', 'active', 1, 1, 0, 0, 0);

-- =====================================================
-- INSTITUTES
-- =====================================================
INSERT INTO institutes (name, district, zone) VALUES
    ('GCTW Sahiwal', 'Sahiwal', 'Center'),
    ('GSTC Dev Samaj', 'Lahore', 'Center'),
    ('GVTIW Dev Samaj', 'Lahore', 'Center'),
    ('GVTI (W) Dev Samaj Road', 'Lahore', 'Center'),
    ('GTTI Gujjarpura', 'Lahore', 'Center'),
    ('GCTW Multan', 'Multan', 'South'),
    ('GCTW Bahwalpur', 'Bahawalpur', 'South'),
    ('GCTW Faisalabad', 'Faisalabad', 'North'),
    ('GCTW Sargodha', 'Sargodha', 'North'),
    ('GVTI (W) Jia Musa Shahdra', 'Lahore', 'Center'),
    ('GVTI (W) Pattoki', 'Lahore', 'Center'),
    ('GVTI (W) RSLN', 'Lahore', 'Center'),
    ('GVTI (W) Depalpur', 'Okara', 'Center'),
    ('GTTI Kamal Gunj', 'Lahore', 'Center'),
    ('GVTI (W) Samundri', 'Faisalabad', 'North'),
    ('Quaid-e-Azam Business Park Sheikhupura', 'Lahore', 'Center'),
    ('COE Mughalpura', 'Lahore', 'Center'),
    ('GCT For GC&PD Shahdara', 'Lahore', 'Center'),
    ('Wood Working Service Centre Gujrat', 'Gujrat', 'Center'),
    ('GILT Kasur', 'Kasur', 'Center'),
    ('GSTC Bahawalpur', 'Bahawalpur', 'South');

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO categories (name, description, institute_id) VALUES
    -- GCTW Sahiwal
    ('Garments & Fashion Design', 'Fashion and clothing items', 1),
    
    -- GSTC Dev Samaj
    ('Handi Craft', 'Traditional handicraft items', 2),
    ('Home Textile', 'Textile items for home decoration', 2),
    
    -- GVTIW Dev Samaj
    ('Handi Craft', 'Traditional handicraft items', 3),
    ('Home Textile', 'Textile items for home use', 3),
    
    -- GVTI (W) Dev Samaj Road
    ('Handi Craft', 'Islamic calligraphy and art pieces', 4),
    ('Home Textile', 'Home textile items', 4),
    
    -- GTTI Gujjarpura
    ('Handi Craft', 'Paintings and art', 5),
    
    -- GCTW Multan
    ('Handi Craft', 'Traditional crafts', 6),
    ('Garments & Fashion Design', 'Fashion items', 6),
    
    -- GCTW Bahwalpur
    ('Fashion Design', 'Fashion design items', 7),
    ('Garments & Fashion Design', 'Garments and fashion', 7),
    ('Handi Craft', 'Handicraft items', 7),
    
    -- GCTW Faisalabad
    ('Garments & Fashion Design', 'Fashion items', 8),
    
    -- GCTW Sargodha
    ('Home Textile', 'Home textile items', 9),
    ('Handi Craft', 'Handicraft items', 9),
    
    -- GVTI (W) Jia Musa Shahdra
    ('Handi Craft', 'Islamic art', 10),
    
    -- GVTI (W) Pattoki
    ('Handi Craft', 'Islamic art', 11),
    ('Home Textile', 'Home textiles', 11),
    
    -- GVTI (W) RSLN
    ('Handi Craft', 'Wall hangings and art', 12),
    
    -- GVTI (W) Depalpur
    ('Handi Craft', 'Embroidered items', 13),
    
    -- GTTI Kamal Gunj
    ('Handi Craft', 'Art pieces', 14),
    ('Home Textile', 'Home textiles', 14),
    
    -- GVTI (W) Samundri
    ('Home Textile', 'Table mats and home items', 15),
    
    -- Quaid-e-Azam Business Park Sheikhupura
    ('Handi Craft', 'Denim products', 16),
    
    -- COE Mughalpura
    ('Handi Craft', 'Various handicrafts', 17),
    
    -- GCT For GC&PD Shahdara
    ('Blue Pottery / Ceramic', 'Ceramic and pottery items', 18),
    
    -- Wood Working Service Centre Gujrat
    ('Wood Work & Furniture', 'Wooden furniture', 19),
    
    -- GILT Kasur
    ('Leather', 'Leather handicrafts', 20),
    
    -- GSTC Bahawalpur
    ('Handi Craft', 'Various handicrafts', 21);

-- =====================================================
-- PRODUCTS
-- =====================================================

-- GCTW Sahiwal Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Sahiwal', 'GCTW Sahiwal', 1, 'Garments & Fashion Design', 'Crochet Cardigan', '1', 'GCTW-SAH-001', 1, 4000.00, 2800.00, 3, 'Beautiful handmade crochet cardigan', 'BAR-001', 1),
    ('Center', 'Sahiwal', 'GCTW Sahiwal', 1, 'Garments & Fashion Design', 'Crochet Cardigan', '1', 'GCTW-SAH-002', 1, 4000.00, 2800.00, 1, 'Beautiful handmade crochet cardigan', 'BAR-002', 1),
    ('Center', 'Sahiwal', 'GCTW Sahiwal', 1, 'Garments & Fashion Design', 'Crochet Cardigan', '1', 'GCTW-SAH-003', 1, 4000.00, 2800.00, 1, 'Beautiful handmade crochet cardigan', 'BAR-003', 1);

-- GSTC Dev Samaj Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Hand Painted Lawn Dupatta', '1', 'GSTC-DS-001', 2, 1800.00, 1260.00, 5, 'Beautiful hand painted dupatta', 'BAR-004', 2),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Decorative Pots', '1', 'GSTC-DS-002', 2, 3000.00, 2100.00, 7, 'Hand painted decorative pots - Different sizes', 'BAR-005', 3),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Home Textile', 'Dupatta Embroidery Painting', '1', 'GSTC-DS-003', 3, 800.00, 560.00, 8, 'Embroidery painting on dupatta', 'BAR-006', 3),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Bags', '1', 'GSTC-DS-004', 2, 700.00, 490.00, 30, 'Handcrafted bags', 'BAR-007', 10),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Bedsheets', '1', 'GSTC-DS-005', 2, 9000.00, 6300.00, 2, 'Handcrafted bedsheets', 'BAR-008', 1),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Table Mats (04 pcs)', '1', 'GSTC-DS-006', 2, 2000.00, 1400.00, 4, 'Set of 4 table mats', 'BAR-009', 2),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Cup Cover', '1', 'GSTC-DS-007', 2, 800.00, 560.00, 12, 'Cup covers', 'BAR-010', 5),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Kurtas', '1', 'GSTC-DS-008', 2, 1700.00, 1190.00, 9, 'Traditional kurtas', 'BAR-011', 4),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Stoller', '1', 'GSTC-DS-009', 2, 1000.00, 700.00, 6, 'Stroller covers', 'BAR-012', 3),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Gloves', '1', 'GSTC-DS-010', 2, 700.00, 490.00, 2, 'Handcrafted gloves', 'BAR-013', 1),
    ('Center', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Frames', '1', 'GSTC-DS-011', 2, 2000.00, 1400.00, 7, 'Decorative frames', 'BAR-014', 3);

-- GVTIW Dev Samaj Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GVTIW Dev Samaj', 3, 'Home Textile', 'Bed Set', '1', 'GVTIW-DS-001', 5, 38000.00, 26600.00, 1, 'Premium bed set with embroidery', 'BAR-015', 1),
    ('Center', 'Lahore', 'GVTIW Dev Samaj', 3, 'Home Textile', 'Cushions', '1', 'GVTIW-DS-002', 5, 7000.00, 4900.00, 1, 'Decorative cushion set', 'BAR-016', 1),
    ('Center', 'Lahore', 'GVTIW Dev Samaj', 3, 'Handi craft', 'Painting Frame', '1', 'GVTIW-DS-003', 4, 32000.00, 22400.00, 1, 'Large painting frame', 'BAR-017', 1),
    ('Center', 'Lahore', 'GVTIW Dev Samaj', 3, 'Handi craft', 'Calligraphy Canvas', '1', 'GVTIW-DS-004', 4, 22000.00, 15400.00, 1, 'Calligraphy on canvas', 'BAR-018', 1),
    ('Center', 'Lahore', 'GVTIW Dev Samaj', 3, 'Handi craft', 'Calligraphy Canvas', '1', 'GVTIW-DS-005', 4, 30000.00, 21000.00, 1, 'Large calligraphy canvas', 'BAR-019', 1),
    ('Center', 'Lahore', 'GVTIW Dev Samaj', 3, 'Handi craft', 'Embellished Dupatta', '1', 'GVTIW-DS-006', 4, 4000.00, 2800.00, 3, 'Embellished dupatta', 'BAR-020', 1);

-- GTTI Gujjarpura Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GTTI Gujjarpura', 5, 'Handi craft', 'Paintings', '1', 'GTTI-GJP-001', 8, 8500.00, 5950.00, 14, 'Hand-made paintings', 'BAR-021', 5),
    ('Center', 'Lahore', 'GTTI Gujjarpura', 5, 'Handi craft', 'Hand Made Painting', '1', 'GTTI-GJP-002', 8, 20000.00, 14000.00, 4, 'Large hand-made painting', 'BAR-022', 2);

-- GCTW Multan Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('South', 'Multan', 'GCTW Multan', 6, 'Handi craft', 'Crochet Products', '1', 'GCTW-MLT-001', 9, 350.00, 245.00, 50, 'Various crochet products', 'BAR-023', 20),
    ('South', 'Multan', 'GCTW Multan', 6, 'Handi craft', 'Hand Made Painting', '1', 'GCTW-MLT-002', 9, 8000.00, 5600.00, 2, 'Hand-made paintings', 'BAR-024', 1),
    ('South', 'Multan', 'GCTW Multan', 6, 'Garments & Fashion Design', 'Crochet Sweater', '1', 'GCTW-MLT-003', 10, 2600.00, 1820.00, 1, 'Hand-made crochet sweater', 'BAR-025', 1),
    ('South', 'Multan', 'GCTW Multan', 6, 'Garments & Fashion Design', 'Crochet Bag', '1', 'GCTW-MLT-004', 10, 1500.00, 1050.00, 1, 'Hand-made crochet bag', 'BAR-026', 1),
    ('South', 'Multan', 'GCTW Multan', 6, 'Garments & Fashion Design', 'Beaded Purse', '1', 'GCTW-MLT-005', 10, 4000.00, 2800.00, 10, 'Beaded decorative purse', 'BAR-027', 4);

-- GCTW Bahwalpur Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Fashion Design', 'Hand Painted Embellished Dupattas', '1', 'GCTW-BWP-001', 11, 1800.00, 1260.00, 18, 'Hand painted and embellished dupattas', 'BAR-028', 7),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Hand Painted Embellished Dupattas', '1', 'GCTW-BWP-002', 13, 2200.00, 1540.00, 4, 'Premium embellished dupattas', 'BAR-029', 2),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Hand Painted Embellished Dupattas', '1', 'GCTW-BWP-003', 13, 2500.00, 1750.00, 3, 'Organza embellished dupattas', 'BAR-030', 2),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Tie & Dye Dupata', '1', 'GCTW-BWP-004', 13, 1800.00, 1260.00, 7, 'Traditional tie & dye dupatta', 'BAR-031', 3),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Tie & Dye Dupata', '1', 'GCTW-BWP-005', 13, 2500.00, 1750.00, 2, 'Premium tie & dye dupatta', 'BAR-032', 1),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Embellished Dupattas', '1', 'GCTW-BWP-006', 13, 2400.00, 1680.00, 2, 'Embellished organza dupatta', 'BAR-033', 1),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Garments & Fashion Design', 'Ladies Jeans', '1', 'GCTW-BWP-007', 12, 2200.00, 1540.00, 11, 'Ladies jeans', 'BAR-034', 5),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Ladies Jeans', '1', 'GCTW-BWP-008', 13, 2600.00, 1820.00, 2, 'Premium ladies jeans', 'BAR-035', 1),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Ladies Jeans', '1', 'GCTW-BWP-009', 13, 2500.00, 1750.00, 3, 'Designer ladies jeans', 'BAR-036', 1),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Handi Craft', 'Ladies Kurta', '1', 'GCTW-BWP-010', 13, 3000.00, 2100.00, 8, 'Traditional ladies kurta', 'BAR-037', 3),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 7, 'Fashion Design', 'Ladies Kurta', '1', 'GCTW-BWP-011', 11, 3500.00, 2450.00, 8, 'Premium ladies kurta', 'BAR-038', 3);

-- GCTW Faisalabad Products  
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('North', 'Faisalabad', 'GCTW Faisalabad', 8, 'Garments & Fashion Design', 'Crochet Bag', '1', 'GCTW-FSD-001', 14, 1000.00, 700.00, 8, 'Hand-made crochet bag', 'BAR-039', 3),
    ('North', 'Faisalabad', 'GCTW Faisalabad', 8, 'Garments & Fashion Design', 'Crochet Frock', '1', 'GCTW-FSD-002', 14, 1800.00, 1260.00, 8, 'Hand-made crochet frock', 'BAR-040', 3);

-- GCTW Sargodha Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('North', 'Sargodha', 'GCTW Sargodha', 9, 'Home Textile', 'Screen Print / Hand Embellished Bedsheet', '1', 'GCTW-SGD-001', 15, 20000.00, 14000.00, 2, 'Screen printed bedsheet with hand embellishments', 'BAR-041', 1),
    ('North', 'Sargodha', 'GCTW Sargodha', 9, 'Handi Craft', 'Hand Craft', '1', 'GCTW-SGD-002', 16, 20000.00, 14000.00, 1, 'Various handicraft items', 'BAR-042', 1);

-- GVTI (W) Dev Samaj Road Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Islamic Calligraphy with Oil Paint', '1', 'GVTI-DSR-001', 6, 15000.00, 10500.00, 3, 'Islamic calligraphy - Premium size', 'BAR-043', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Islamic Calligraphy with Oil Paint', '1', 'GVTI-DSR-002', 6, 10000.00, 7000.00, 1, 'Islamic calligraphy - Medium size', 'BAR-044', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Wall Hanging with Oil Paint', '1', 'GVTI-DSR-003', 6, 25000.00, 17500.00, 1, 'Large wall hanging', 'BAR-045', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Wall Hanging with Oil Paint', '1', 'GVTI-DSR-004', 6, 20000.00, 14000.00, 1, 'Medium wall hanging', 'BAR-046', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Silk Painted Lamps', '1', 'GVTI-DSR-005', 6, 8000.00, 5600.00, 1, 'Decorative silk painted lamp', 'BAR-047', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Home Textile', 'Silk Painted Lamps', '1', 'GVTI-DSR-006', 7, 8000.00, 5600.00, 1, 'Silk painted lamp', 'BAR-048', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Wooden Screen', '1', 'GVTI-DSR-007', 6, 20000.00, 14000.00, 1, 'Decorative wooden screen', 'BAR-049', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Hand-Embellished Pots', '1', 'GVTI-DSR-008', 6, 3000.00, 2100.00, 1, 'Hand embellished decorative pots', 'BAR-050', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Home Textile', 'Bed Spread Set', '1', 'GVTI-DSR-009', 7, 30000.00, 21000.00, 1, 'Premium bed spread set', 'BAR-051', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Organza Dupatta', '1', 'GVTI-DSR-010', 6, 2500.00, 1750.00, 2, 'Organza dupatta', 'BAR-052', 1),
    ('Center', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Handi craft', 'Organza Dupatta', '1', 'GVTI-DSR-011', 6, 4000.00, 2800.00, 3, 'Premium organza dupatta', 'BAR-053', 1);

-- GVTI (W) Jia Musa Shahdra Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GVTI (W) Jia Musa Shahdra', 10, 'Handi craft', 'Islamic Calligraphy with Oil Paint', '1', 'GVTI-JMS-001', 17, 900.00, 630.00, 2, 'Small Islamic calligraphy', 'BAR-054', 1);

-- GVTI (W) Pattoki Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GVTI (W) Pattoki', 11, 'Handi craft', 'Islamic Calligraphy with Oil Paint', '1', 'GVTI-PTK-001', 18, 10000.00, 7000.00, 1, 'Islamic calligraphy art', 'BAR-055', 1),
    ('Center', 'Lahore', 'GVTI (W) Pattoki', 11, 'Home Textile', 'Silk Bed Spread Set', '1', 'GVTI-PTK-002', 19, 35000.00, 24500.00, 1, 'Premium silk bed spread', 'BAR-056', 1),
    ('Center', 'Lahore', 'GVTI (W) Pattoki', 11, 'Home Textile', 'Rug', '1', 'GVTI-PTK-003', 19, 5000.00, 3500.00, 1, 'Hand-made rug', 'BAR-057', 1);

-- GVTI (W) RSLN Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GVTI (W) RSLN', 12, 'Handi craft', 'Islamic Calligraphy with Oil Paint', '1', 'GVTI-RSLN-001', 20, 40000.00, 28000.00, 1, 'Large Islamic calligraphy', 'BAR-058', 1),
    ('Center', 'Lahore', 'GVTI (W) RSLN', 12, 'Handi craft', 'Wall Hanging with Oil Paint', '1', 'GVTI-RSLN-002', 20, 20000.00, 14000.00, 1, 'Wall hanging', 'BAR-059', 1),
    ('Center', 'Lahore', 'GVTI (W) RSLN', 12, 'Handi craft', 'Wall Hanging with Oil Paint', '1', 'GVTI-RSLN-003', 20, 30000.00, 21000.00, 1, 'Large wall hanging', 'BAR-060', 1),
    ('Center', 'Lahore', 'GVTI (W) RSLN', 12, 'Handi craft', 'Wall Hanging with Oil Paint', '1', 'GVTI-RSLN-004', 20, 40000.00, 28000.00, 1, 'Premium wall hanging', 'BAR-061', 1),
    ('Center', 'Lahore', 'GVTI (W) RSLN', 12, 'Handi craft', 'Wall Hanging with Oil Paint', '1', 'GVTI-RSLN-005', 20, 5000.00, 3500.00, 1, 'Small wall hanging', 'BAR-062', 1),
    ('Center', 'Lahore', 'GVTI (W) RSLN', 12, 'Handi craft', 'Wall Hanging with Oil Paint', '1', 'GVTI-RSLN-006', 20, 8500.00, 5950.00, 1, 'Medium wall hanging', 'BAR-063', 1);

-- GVTI (W) Depalpur Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Okara', 'GVTI (W) Depalpur', 13, 'Handi craft', 'Wall Hanging Embellished with Hand Embroidery', '1', 'GVTI-DPL-001', 21, 8000.00, 5600.00, 1, 'Hand embroidered wall hanging', 'BAR-064', 1);

-- GTTI Kamal Gunj Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GTTI Kamal Gunj', 14, 'Handi craft', 'Oil Painted Vase', '1', 'GTTI-KG-001', 22, 5000.00, 3500.00, 1, 'Oil painted decorative vase', 'BAR-065', 1),
    ('Center', 'Lahore', 'GTTI Kamal Gunj', 14, 'Home Textile', 'Cushions Set', '1', 'GTTI-KG-002', 23, 2500.00, 1750.00, 1, 'Decorative cushions set', 'BAR-066', 1);

-- GVTI (W) Samundri Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('North', 'Faisalabad', 'GVTI (W) Samundri', 15, 'Home Textile', 'Dining Table Mats', '1', 'GVTI-SMD-001', 24, 8000.00, 5600.00, 1, 'Dining table mat set', 'BAR-067', 1),
    ('North', 'Faisalabad', 'GVTI (W) Samundri', 15, 'Home Textile', 'Drawing Room Set', '1', 'GVTI-SMD-002', 24, 9000.00, 6300.00, 1, 'Drawing room set', 'BAR-068', 1);

-- Quaid-e-Azam Business Park Sheikhupura Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'Quaid-e-Azam Business Park Sheikhupura', 16, 'Handi craft', 'Denim Pant', '1', 'QAB-SHP-001', 25, 1200.00, 840.00, 200, 'Denim pants', 'BAR-069', 50),
    ('Center', 'Lahore', 'Quaid-e-Azam Business Park Sheikhupura', 16, 'Handi craft', 'Denim Jacket', '1', 'QAB-SHP-002', 25, 1400.00, 980.00, 200, 'Denim jacket', 'BAR-070', 50);

-- COE Mughalpura Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Tote Bag', '1', 'COE-MGH-001', 26, 1500.00, 1050.00, 12, 'Hand-made tote bag', 'BAR-071', 5),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Calligraphy Painting', '1', 'COE-MGH-002', 26, 2500.00, 1750.00, 2, 'Calligraphy painting', 'BAR-072', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Bottles', '1', 'COE-MGH-003', 26, 600.00, 420.00, 6, 'Decorative bottles', 'BAR-073', 3),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Small Painting', '1', 'COE-MGH-004', 26, 1000.00, 700.00, 4, 'Small paintings', 'BAR-074', 2),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Table Runner', '1', 'COE-MGH-005', 26, 1000.00, 700.00, 1, 'Hand-made table runner', 'BAR-075', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Hand Made Wool Bag', '1', 'COE-MGH-006', 26, 3500.00, 2450.00, 1, 'Wool hand bag', 'BAR-076', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Jeans Bag', '1', 'COE-MGH-007', 26, 800.00, 560.00, 1, 'Jeans bag', 'BAR-077', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Fabric Bag', '1', 'COE-MGH-008', 26, 800.00, 560.00, 1, 'Fabric bag', 'BAR-078', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Fabric Paint Diaries', '1', 'COE-MGH-009', 26, 500.00, 350.00, 8, 'Hand painted diaries', 'BAR-079', 4),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Painted Kurta', '1', 'COE-MGH-010', 26, 2000.00, 1400.00, 2, 'Hand painted kurta', 'BAR-080', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Glass Painting Frames', '1', 'COE-MGH-011', 26, 2000.00, 1400.00, 2, 'Glass painting frames', 'BAR-081', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Fabric Paint Table Runner', '1', 'COE-MGH-012', 26, 1000.00, 700.00, 1, 'Fabric painted table runner', 'BAR-082', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Block Print Table Runner', '1', 'COE-MGH-013', 26, 1000.00, 700.00, 2, 'Block printed table runner', 'BAR-083', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Block Printing Bed Sheet', '1', 'COE-MGH-014', 26, 4500.00, 3150.00, 1, 'Block printed bed sheet', 'BAR-084', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Thermapol Calligraphy Frame', '1', 'COE-MGH-015', 26, 3000.00, 2100.00, 1, 'Calligraphy frame', 'BAR-085', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Embroidery Cushions', '1', 'COE-MGH-016', 26, 600.00, 420.00, 4, 'Embroidered cushions', 'BAR-086', 2),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Fabric Paint Cushions', '1', 'COE-MGH-017', 26, 600.00, 420.00, 2, 'Fabric painted cushions', 'BAR-087', 1),
    ('Center', 'Lahore', 'COE Mughalpura', 17, 'Handi craft', 'Painted Dupatta', '1', 'COE-MGH-018', 26, 3500.00, 2450.00, 5, 'Hand painted dupatta', 'BAR-088', 2);

-- GCT For GC&PD Shahdara Ceramic Products (Blue Pottery)
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Oil Burner', '1', 'GCT-SHD-001', 27, 880.00, 616.00, 6, 'Ceramic oil burner', 'BAR-089', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Tiny Vase', '1', 'GCT-SHD-002', 27, 450.00, 315.00, 5, 'Small floral vase', 'BAR-090', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Square Ashtray', '1', 'GCT-SHD-003', 27, 350.00, 245.00, 5, 'Square ashtray', 'BAR-091', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Mug', '1', 'GCT-SHD-004', 27, 650.00, 455.00, 5, 'Floral ceramic mug', 'BAR-092', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Bread Dish', '1', 'GCT-SHD-005', 27, 2250.00, 1575.00, 3, 'Floral bread dish', 'BAR-093', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Triangle Dish', '1', 'GCT-SHD-006', 27, 1850.00, 1295.00, 2, 'Triangle dish', 'BAR-094', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Pizza Plate (Large)', '1', 'GCT-SHD-007', 27, 1850.00, 1295.00, 2, 'Large pizza plate', 'BAR-095', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Cut Work Table Lamp Base', '1', 'GCT-SHD-008', 27, 8000.00, 5600.00, 2, 'Cut work lamp base', 'BAR-096', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Midnight Blossoms Table Lamp Base', '1', 'GCT-SHD-009', 27, 5000.00, 3500.00, 2, 'Floral lamp base', 'BAR-097', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Blossom Apple Dish', '1', 'GCT-SHD-010', 27, 1500.00, 1050.00, 3, 'Apple shaped dish', 'BAR-098', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Rice Plate (Large)', '1', 'GCT-SHD-011', 27, 2000.00, 1400.00, 3, 'Large rice plate', 'BAR-099', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Small Vase', '1', 'GCT-SHD-012', 27, 750.00, 525.00, 5, 'Small floral vase', 'BAR-100', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Dish', '1', 'GCT-SHD-013', 27, 2000.00, 1400.00, 3, 'Ceramic dish', 'BAR-101', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Apple Dish', '1', 'GCT-SHD-014', 27, 1400.00, 980.00, 3, 'Apple dish', 'BAR-102', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Dinner Plate', '1', 'GCT-SHD-015', 27, 1200.00, 840.00, 6, 'Floral dinner plate', 'BAR-103', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Floral Round Table Lamp Base', '1', 'GCT-SHD-016', 27, 7000.00, 4900.00, 2, 'Round lamp base', 'BAR-104', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral MLV Vase', '1', 'GCT-SHD-017', 27, 9000.00, 6300.00, 2, 'MLV vase', 'BAR-105', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Large Planter', '1', 'GCT-SHD-018', 27, 6000.00, 4200.00, 3, 'Large planter', 'BAR-106', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Mughal Vase', '1', 'GCT-SHD-019', 27, 3500.00, 2450.00, 3, 'Mughal vase', 'BAR-107', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Planter', '1', 'GCT-SHD-020', 27, 6000.00, 4200.00, 2, 'Floral planter', 'BAR-108', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Handmade Planter Small', '1', 'GCT-SHD-021', 27, 1150.00, 805.00, 2, 'Small planter', 'BAR-109', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Ashtray With Lid', '1', 'GCT-SHD-022', 27, 550.00, 385.00, 5, 'Ashtray with lid', 'BAR-110', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Quarter Plates Set', '1', 'GCT-SHD-023', 27, 4300.00, 3010.00, 2, 'Quarter plates set', 'BAR-111', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Floral Table Lamp Base', '1', 'GCT-SHD-024', 27, 3000.00, 2100.00, 2, 'Floral lamp base', 'BAR-112', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Planter Small', '1', 'GCT-SHD-025', 27, 1650.00, 1155.00, 5, 'Small ceramic planter', 'BAR-113', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Handcrafted Sweet Bowls Set', '1', 'GCT-SHD-026', 27, 4100.00, 2870.00, 2, 'Sweet bowls set', 'BAR-114', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramics Floral Pomegranate Vase', '1', 'GCT-SHD-027', 27, 650.00, 455.00, 3, 'Pomegranate vase', 'BAR-115', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramics Dish Small', '1', 'GCT-SHD-028', 27, 450.00, 315.00, 6, 'Small dish', 'BAR-116', 2),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramic Floral Surahi Vase', '1', 'GCT-SHD-029', 27, 3500.00, 2450.00, 2, 'Surahi vase', 'BAR-117', 1),
    ('Center', 'Lahore', 'GCT For GC&PD Shahdara', 18, 'Blue Pottery / Ceramic', 'Ceramics Floral Tea Set', '1', 'GCT-SHD-030', 27, 9500.00, 6650.00, 2, 'Floral tea set', 'BAR-118', 1);

-- Wood Working Service Centre Gujrat Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Double Bed Set', '1', 'WWSC-GJT-001', 28, 396000.00, 277200.00, 3, 'Complete double bed set', 'BAR-119', 1),
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Tea Trolley', '1', 'WWSC-GJT-002', 28, 46787.00, 32750.90, 3, 'Wooden tea trolley', 'BAR-120', 1),
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Nest of Table Set', '1', 'WWSC-GJT-003', 28, 55224.00, 38656.80, 3, 'Nest of tables set', 'BAR-121', 1),
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Tissue Box', '1', 'WWSC-GJT-004', 28, 3068.00, 2147.60, 4, 'Wooden tissue box', 'BAR-122', 2),
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Dining Table Set With 8 Chairs', '1', 'WWSC-GJT-005', 28, 538000.00, 376600.00, 1, 'Complete dining set', 'BAR-123', 1),
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Coffee Table (Round)', '1', 'WWSC-GJT-006', 28, 98113.46, 68679.42, 1, 'Round coffee table', 'BAR-124', 1),
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Coffee Table (Square)', '1', 'WWSC-GJT-007', 28, 127699.60, 89389.72, 1, 'Square coffee table', 'BAR-125', 1),
    ('Center', 'Gujrat', 'Wood Working Service Centre Gujrat', 19, 'Wood Work & Furniture', 'Round Table', '1', 'WWSC-GJT-008', 28, 161912.52, 113338.76, 1, 'Round table', 'BAR-126', 1);

-- GILT Kasur Products (Leather)
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-001', 29, 2000.00, 1400.00, 1, 'Leather handicraft item', 'BAR-127', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-002', 29, 2500.00, 1750.00, 1, 'Leather handicraft item', 'BAR-128', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-003', 29, 2000.00, 1400.00, 1, 'Leather handicraft item', 'BAR-129', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-004', 29, 5500.00, 3850.00, 1, 'Premium leather craft', 'BAR-130', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-005', 29, 6000.00, 4200.00, 1, 'Premium leather craft', 'BAR-131', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-006', 29, 4500.00, 3150.00, 1, 'Leather handicraft item', 'BAR-132', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-007', 29, 4000.00, 2800.00, 1, 'Leather handicraft item', 'BAR-133', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-008', 29, 6000.00, 4200.00, 1, 'Premium leather craft', 'BAR-134', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-009', 29, 4000.00, 2800.00, 1, 'Leather handicraft item', 'BAR-135', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-010', 29, 5000.00, 3500.00, 1, 'Leather handicraft item', 'BAR-136', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-011', 29, 3500.00, 2450.00, 1, 'Leather handicraft item', 'BAR-137', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-012', 29, 6000.00, 4200.00, 2, 'Premium leather craft', 'BAR-138', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-013', 29, 6500.00, 4550.00, 1, 'Premium leather craft', 'BAR-139', 1),
    ('Center', 'Kasur', 'GILT Kasur', 20, 'Leather', 'Leather Hand Craft', '1', 'GILT-KSR-014', 29, 6000.00, 4200.00, 2, 'Premium leather craft', 'BAR-140', 1);

-- GSTC Bahawalpur Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Dining Table Runner and Placement Set', '1', 'GSTC-BWP-001', 30, 2200.00, 1540.00, 20, 'Table runner and placement set', 'BAR-141', 8),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Coffee Table Runners', '1', 'GSTC-BWP-002', 30, 1800.00, 1260.00, 20, 'Coffee table runners', 'BAR-142', 8),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Bed Sheets', '1', 'GSTC-BWP-003', 30, 4000.00, 2800.00, 2, 'Hand-made bed sheets', 'BAR-143', 1),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Sofa Cushions', '1', 'GSTC-BWP-004', 30, 1000.00, 700.00, 20, 'Sofa cushions', 'BAR-144', 8),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Lamp Shades', '1', 'GSTC-BWP-005', 30, 1500.00, 1050.00, 8, 'Decorative lamp shades', 'BAR-145', 3),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Wooden Trays', '1', 'GSTC-BWP-006', 30, 1500.00, 1050.00, 25, 'Wooden decorative trays', 'BAR-146', 10),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Shawls', '1', 'GSTC-BWP-007', 30, 2500.00, 1750.00, 10, 'Traditional shawls', 'BAR-147', 4),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Semi Formal Dresses', '1', 'GSTC-BWP-008', 30, 6000.00, 4200.00, 4, 'Semi formal dresses', 'BAR-148', 2),
    ('South', 'Bahawalpur', 'GSTC Bahawalpur', 21, 'Handi craft', 'Hand Embroidered Kurty', '1', 'GSTC-BWP-009', 30, 2500.00, 1750.00, 5, 'Hand embroidered kurty', 'BAR-149', 2);

-- =====================================================
-- CUSTOMERS
-- =====================================================
INSERT INTO customers (name, email, phone, address) VALUES
    ('Ahmed Khan', 'ahmed.khan@email.com', '+92-300-1234567', 'House 123, Street 5, F-8/3, Islamabad'),
    ('Fatima Malik', 'fatima.malik@email.com', '+92-321-9876543', 'Flat 45, DHA Phase 6, Lahore'),
    ('Hassan Ali', 'hassan.ali@email.com', '+92-333-5555555', 'House 67, Gulberg III, Lahore'),
    ('Ayesha Siddique', 'ayesha.s@email.com', '+92-345-7777777', 'Apartment 12, Bahria Town, Rawalpindi'),
    ('Usman Tariq', 'usman.tariq@email.com', '+92-301-8888888', 'House 234, Model Town, Faisalabad'),
    ('Zainab Ahmed', 'zainab.a@email.com', '+92-322-4444444', 'Villa 56, Canal Road, Multan'),
    ('Bilal Hussain', 'bilal.h@email.com', '+92-334-6666666', 'House 89, Cavalry Ground, Lahore'),
    ('Sara Iqbal', 'sara.iqbal@email.com', '+92-312-9999999', 'Flat 23, Clifton, Karachi'),
    ('Walk-in Customer', NULL, NULL, NULL),
    ('Corporate Order', 'corporate@company.com', '+92-300-1111111', 'Office 301, Blue Area, Islamabad');

-- =====================================================
-- SAMPLE TRANSACTIONS
-- =====================================================

-- Transaction 1
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0001',
    1,
    'Ahmed Khan',
    8000.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 1, "product_name": "Crochet Cardigan", "quantity": 2, "price": 4000.00, "total": 8000.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '5 days'
);

-- Transaction 2
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0002',
    2,
    'Fatima Malik',
    45000.00,
    3000.00,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 11, "product_name": "Bed Set", "quantity": 1, "price": 38000.00, "total": 38000.00},
        {"product_id": 12, "product_name": "Cushions", "quantity": 1, "price": 7000.00, "total": 7000.00}
    ]'::jsonb,
    3,
    NOW() - INTERVAL '4 days'
);

-- Transaction 3
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0003',
    3,
    'Hassan Ali',
    25000.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 59, "product_name": "Islamic Calligraphy with Oil Paint", "quantity": 1, "price": 15000.00, "total": 15000.00},
        {"product_id": 60, "product_name": "Islamic Calligraphy with Oil Paint", "quantity": 1, "price": 10000.00, "total": 10000.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '3 days'
);

-- Transaction 4
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0004',
    9,
    'Walk-in Customer',
    3600.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 4, "product_name": "Hand Painted Lawn Dupatta", "quantity": 2, "price": 1800.00, "total": 3600.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '2 days'
);

-- Transaction 5
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0005',
    5,
    'Usman Tariq',
    11500.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 114, "product_name": "Ceramic Floral MLV Vase", "quantity": 1, "price": 9000.00, "total": 9000.00},
        {"product_id": 108, "product_name": "Ceramic Floral Dinner Plate", "quantity": 2, "price": 1200.00, "total": 2400.00}
    ]'::jsonb,
    3,
    NOW() - INTERVAL '1 day'
);

-- =====================================================
-- Update product quantities based on transactions
-- =====================================================

UPDATE products SET quantity = quantity - 2 WHERE id = 1;
UPDATE products SET quantity = quantity - 1 WHERE id = 11;
UPDATE products SET quantity = quantity - 1 WHERE id = 12;
UPDATE products SET quantity = quantity - 1 WHERE id = 59;
UPDATE products SET quantity = quantity - 1 WHERE id = 60;
UPDATE products SET quantity = quantity - 2 WHERE id = 4;
UPDATE products SET quantity = quantity - 1 WHERE id = 114;
UPDATE products SET quantity = quantity - 2 WHERE id = 108;

-- =====================================================
-- SUMMARY
-- =====================================================
SELECT 'Comprehensive seed data inserted successfully!' AS status;
SELECT '5 Users, 21 Institutes, 30 Categories, 149+ Products, 10 Customers, 5 Transactions' AS summary;
