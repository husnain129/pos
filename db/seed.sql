-- Seed Data for Creative Hands POS System
-- This includes institutes, categories, products, customers, users, and transactions

-- =====================================================
-- CLEANUP - Remove existing seed data (except admin user and default settings)
-- =====================================================
-- Delete in reverse order of dependencies
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
-- USERS (Additional users beyond default admin)
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
    ('GCTW Sahiwal', 'Sahiwal', 'Central'),
    ('GSTC Dev Samaj', 'Lahore', 'North'),
    ('GVTIW Dev Samaj', 'Lahore', 'North'),
    ('GVTI (W) Dev Samaj Road', 'Lahore', 'North'),
    ('GCTW Bahwalpur', 'Bahawalpur', 'South'),
    ('GCTW Multan', 'Multan', 'South'),
    ('GVTI Faisalabad', 'Faisalabad', 'Central'),
    ('GCTW Rawalpindi', 'Rawalpindi', 'North');

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO categories (name, description, institute_id) VALUES
    -- GCTW Sahiwal categories
    ('Garments & Fashion Design', 'Fashion and clothing items', 1),
    
    -- GSTC Dev Samaj categories
    ('Handi Craft', 'Traditional handicraft items', 2),
    ('Home Textile', 'Textile items for home decoration', 2),
    
    -- GVTIW Dev Samaj categories
    ('Home Textile', 'Textile items for home use', 3),
    
    -- GVTI (W) Dev Samaj Road categories
    ('Islamic Art', 'Islamic calligraphy and art pieces', 4),
    ('Wall Decor', 'Wall hangings and decorative items', 4),
    
    -- GCTW Bahwalpur categories
    ('Hand Craft', 'Hand-crafted traditional items', 5),
    
    -- GCTW Multan categories
    ('Blue Pottery', 'Traditional blue pottery items', 6),
    ('Embroidery', 'Embroidered textile items', 6),
    
    -- GVTI Faisalabad categories
    ('Furniture', 'Handcrafted wooden furniture', 7),
    ('Leather Goods', 'Leather accessories and items', 7),
    
    -- GCTW Rawalpindi categories
    ('Metal Craft', 'Metal artwork and items', 8),
    ('Jewelry', 'Handmade jewelry items', 8);

-- =====================================================
-- PRODUCTS (Based on the uploaded images)
-- =====================================================

-- GCTW Sahiwal Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Central', 'Sahiwal', 'GCTW Sahiwal', 1, 'Garments & Fashion Design', 'Crochet Cardigan', 'Handmade crochet cardigan - Medium Size', 'GCTW-SAH-001', 1, 4000.00, 2800.00, 5, 'Beautiful handmade crochet cardigan', 'BAR-001', 2),
    ('Central', 'Sahiwal', 'GCTW Sahiwal', 1, 'Garments & Fashion Design', 'Embroidered Shawl', 'Traditional embroidered shawl', 'GCTW-SAH-002', 1, 3500.00, 2200.00, 8, 'Elegant embroidered shawl', 'BAR-002', 3),
    ('Central', 'Sahiwal', 'GCTW Sahiwal', 1, 'Garments & Fashion Design', 'Designer Dupatta', 'Premium designer dupatta', 'GCTW-SAH-003', 1, 2800.00, 1800.00, 12, 'Premium quality dupatta', 'BAR-003', 5);

-- GSTC Dev Samaj Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('North', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Hand Painted Lawn Dupatta', 'Hand painted lawn dupatta', 'GSTC-DS-001', 2, 1800.00, 1200.00, 5, 'Beautiful hand painted dupatta', 'BAR-004', 2),
    ('North', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Decorative Pots', 'Different sizes - Hand painted', 'GSTC-DS-002', 2, 3000.00, 2000.00, 7, 'Hand painted decorative pots', 'BAR-005', 3),
    ('North', 'Lahore', 'GSTC Dev Samaj', 2, 'Home Textile', 'Dupatta Embroidery Painting', 'Embroidered and painted dupatta', 'GSTC-DS-003', 3, 800.00, 500.00, 8, 'Embroidery painting on dupatta', 'BAR-006', 4),
    ('North', 'Lahore', 'GSTC Dev Samaj', 2, 'Handi craft', 'Ceramic Vase', 'Hand painted ceramic vase - Large', 'GSTC-DS-004', 2, 2500.00, 1600.00, 6, 'Beautiful ceramic vase', 'BAR-007', 2);

-- GVTIW Dev Samaj Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('North', 'Lahore', 'GVTIW Dev Samaj', 3, 'Home Textile', 'Bed Set', 'Complete bed set with pillows', 'GVTIW-DS-001', 4, 38000.00, 28000.00, 1, 'Premium bed set with embroidery', 'BAR-008', 1),
    ('North', 'Lahore', 'GVTIW Dev Samaj', 3, 'Home Textile', 'Cushions Set', 'Set of decorative cushions', 'GVTIW-DS-002', 4, 7000.00, 5000.00, 3, 'Decorative cushion set', 'BAR-009', 2),
    ('North', 'Lahore', 'GVTIW Dev Samaj', 3, 'Home Textile', 'Table Runner', 'Embroidered table runner', 'GVTIW-DS-003', 4, 2500.00, 1500.00, 5, 'Beautiful table runner', 'BAR-010', 2),
    ('North', 'Lahore', 'GVTIW Dev Samaj', 3, 'Home Textile', 'Curtains Set', 'Pair of embroidered curtains', 'GVTIW-DS-004', 4, 15000.00, 10000.00, 2, 'Premium curtains with embroidery', 'BAR-011', 1);

-- GVTI (W) Dev Samaj Road Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('North', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Islamic Art', 'Islamic Calligraphy with Oil Paint', 'Premium Size - Oil painting', 'GVTI-DSR-001', 5, 15000.00, 10000.00, 2, 'Beautiful Islamic calligraphy', 'BAR-012', 1),
    ('North', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Islamic Art', 'Islamic Calligraphy with Oil Paint', 'Medium Size - Oil painting', 'GVTI-DSR-002', 5, 10000.00, 7000.00, 1, 'Islamic calligraphy art piece', 'BAR-013', 1),
    ('North', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Wall Decor', 'Wall Hanging with Oil Paint', 'Large Size', 'GVTI-DSR-003', 6, 25000.00, 18000.00, 1, 'Large decorative wall hanging', 'BAR-014', 1),
    ('North', 'Lahore', 'GVTI (W) Dev Samaj Road', 4, 'Wall Decor', 'Wall Hanging with Oil Paint', 'Medium Size', 'GVTI-DSR-004', 6, 20000.00, 14000.00, 1, 'Medium decorative wall hanging', 'BAR-015', 1);

-- GCTW Bahwalpur Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 5, 'Hand Craft', 'Hand Painted Embellished Dupattas', 'Paper Cotton', 'GCTW-BW-001', 7, 2200.00, 1500.00, 2, 'Hand painted dupatta with embellishments', 'BAR-016', 1),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 5, 'Hand Craft', 'Hand Painted Embellished Dupattas', 'Organza', 'GCTW-BW-002', 7, 2500.00, 1700.00, 3, 'Organza dupatta with embellishments', 'BAR-017', 2),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 5, 'Hand Craft', 'Tie & Dye Dupata', 'China Silk', 'GCTW-BW-003', 7, 1800.00, 1200.00, 2, 'Traditional tie and dye dupatta', 'BAR-018', 1),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 5, 'Hand Craft', 'Tie & Dye Dupata', 'Crinkle boti', 'GCTW-BW-004', 7, 2500.00, 1700.00, 2, 'Crinkle boti tie and dye', 'BAR-019', 1),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 5, 'Hand Craft', 'Tie and Dye Dupatta', 'Chicken kari', 'GCTW-BW-005', 7, 1800.00, 1200.00, 3, 'Chicken kari tie and dye', 'BAR-020', 2),
    ('South', 'Bahawalpur', 'GCTW Bahwalpur', 5, 'Hand Craft', 'Embellished Dupattas', 'Organza', 'GCTW-BW-006', 7, 2400.00, 1600.00, 2, 'Embellished organza dupatta', 'BAR-021', 1);

-- GCTW Multan Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('South', 'Multan', 'GCTW Multan', 6, 'Blue Pottery', 'Blue Pottery Vase', 'Traditional Multani design - Large', 'GCTW-MLT-001', 8, 4500.00, 3000.00, 4, 'Traditional blue pottery vase', 'BAR-022', 2),
    ('South', 'Multan', 'GCTW Multan', 6, 'Blue Pottery', 'Blue Pottery Bowl Set', 'Set of 6 bowls', 'GCTW-MLT-002', 8, 3800.00, 2500.00, 3, 'Decorative bowl set', 'BAR-023', 2),
    ('South', 'Multan', 'GCTW Multan', 6, 'Embroidery', 'Embroidered Cushion Covers', 'Set of 4 - Traditional design', 'GCTW-MLT-003', 9, 3200.00, 2200.00, 6, 'Traditional embroidered cushions', 'BAR-024', 3),
    ('South', 'Multan', 'GCTW Multan', 6, 'Blue Pottery', 'Blue Pottery Plate', 'Decorative wall plate', 'GCTW-MLT-004', 8, 2800.00, 1800.00, 5, 'Decorative wall plate', 'BAR-025', 2);

-- GVTI Faisalabad Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('Central', 'Faisalabad', 'GVTI Faisalabad', 7, 'Furniture', 'Handcrafted Coffee Table', 'Sheesham wood - Medium size', 'GVTI-FSD-001', 10, 18000.00, 12000.00, 2, 'Beautiful handcrafted coffee table', 'BAR-026', 1),
    ('Central', 'Faisalabad', 'GVTI Faisalabad', 7, 'Furniture', 'Wooden Wall Shelf', 'Decorative wall mounted shelf', 'GVTI-FSD-002', 10, 6500.00, 4500.00, 4, 'Handcrafted wall shelf', 'BAR-027', 2),
    ('Central', 'Faisalabad', 'GVTI Faisalabad', 7, 'Leather Goods', 'Leather Handbag', 'Genuine leather - Medium size', 'GVTI-FSD-003', 11, 5500.00, 3800.00, 5, 'Handcrafted leather handbag', 'BAR-028', 2),
    ('Central', 'Faisalabad', 'GVTI Faisalabad', 7, 'Leather Goods', 'Leather Wallet', 'Genuine leather - Bifold', 'GVTI-FSD-004', 11, 2200.00, 1500.00, 10, 'Premium leather wallet', 'BAR-029', 4);

-- GCTW Rawalpindi Products
INSERT INTO products (zone, district, institute_name, institute_id, product_category, product_name, product_specifications, product_code, category_id, price, cost_price, quantity, description, barcode, alert_quantity) VALUES
    ('North', 'Rawalpindi', 'GCTW Rawalpindi', 8, 'Metal Craft', 'Brass Decorative Bowl', 'Hand engraved - Large', 'GCTW-RWP-001', 12, 4200.00, 2800.00, 3, 'Beautiful brass bowl', 'BAR-030', 2),
    ('North', 'Rawalpindi', 'GCTW Rawalpindi', 8, 'Metal Craft', 'Copper Tea Set', '6 piece tea set', 'GCTW-RWP-002', 12, 8500.00, 6000.00, 2, 'Traditional copper tea set', 'BAR-031', 1),
    ('North', 'Rawalpindi', 'GCTW Rawalpindi', 8, 'Jewelry', 'Silver Earrings', 'Handcrafted silver with stones', 'GCTW-RWP-003', 13, 3500.00, 2500.00, 8, 'Beautiful silver earrings', 'BAR-032', 3),
    ('North', 'Rawalpindi', 'GCTW Rawalpindi', 8, 'Jewelry', 'Silver Necklace Set', 'Necklace with matching earrings', 'GCTW-RWP-004', 13, 12000.00, 8500.00, 4, 'Premium silver jewelry set', 'BAR-033', 2);

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

-- Transaction 1: Multiple items purchase
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0001',
    1,
    'Ahmed Khan',
    11800.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 1, "product_name": "Crochet Cardigan", "quantity": 2, "price": 4000.00, "total": 8000.00},
        {"product_id": 4, "product_name": "Hand Painted Lawn Dupatta", "quantity": 2, "price": 1800.00, "total": 3600.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '5 days'
);

-- Transaction 2: Large bed set purchase
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
        {"product_id": 8, "product_name": "Bed Set", "quantity": 1, "price": 38000.00, "total": 38000.00},
        {"product_id": 9, "product_name": "Cushions Set", "quantity": 1, "price": 7000.00, "total": 7000.00}
    ]'::jsonb,
    3,
    NOW() - INTERVAL '4 days'
);

-- Transaction 3: Art purchase
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0003',
    3,
    'Hassan Ali',
    45000.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 12, "product_name": "Islamic Calligraphy with Oil Paint", "quantity": 2, "price": 15000.00, "total": 30000.00},
        {"product_id": 13, "product_name": "Islamic Calligraphy with Oil Paint", "quantity": 1, "price": 10000.00, "total": 10000.00},
        {"product_id": 5, "product_name": "Decorative Pots", "quantity": 1, "price": 3000.00, "total": 3000.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '3 days'
);

-- Transaction 4: Bahwalpur handicrafts
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0004',
    4,
    'Ayesha Siddique',
    9000.00,
    500.00,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 16, "product_name": "Hand Painted Embellished Dupattas", "quantity": 2, "price": 2200.00, "total": 4400.00},
        {"product_id": 17, "product_name": "Hand Painted Embellished Dupattas", "quantity": 2, "price": 2500.00, "total": 5000.00}
    ]'::jsonb,
    3,
    NOW() - INTERVAL '2 days'
);

-- Transaction 5: Blue pottery items
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0005',
    5,
    'Usman Tariq',
    11100.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 22, "product_name": "Blue Pottery Vase", "quantity": 1, "price": 4500.00, "total": 4500.00},
        {"product_id": 23, "product_name": "Blue Pottery Bowl Set", "quantity": 1, "price": 3800.00, "total": 3800.00},
        {"product_id": 25, "product_name": "Blue Pottery Plate", "quantity": 1, "price": 2800.00, "total": 2800.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '1 day'
);

-- Transaction 6: Furniture purchase
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0006',
    6,
    'Zainab Ahmed',
    24500.00,
    2000.00,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 26, "product_name": "Handcrafted Coffee Table", "quantity": 1, "price": 18000.00, "total": 18000.00},
        {"product_id": 27, "product_name": "Wooden Wall Shelf", "quantity": 1, "price": 6500.00, "total": 6500.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '12 hours'
);

-- Transaction 7: Jewelry purchase
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0007',
    7,
    'Bilal Hussain',
    15500.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 33, "product_name": "Silver Necklace Set", "quantity": 1, "price": 12000.00, "total": 12000.00},
        {"product_id": 32, "product_name": "Silver Earrings", "quantity": 1, "price": 3500.00, "total": 3500.00}
    ]'::jsonb,
    3,
    NOW() - INTERVAL '6 hours'
);

-- Transaction 8: Walk-in customer small purchase
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0008',
    9,
    'Walk-in Customer',
    5600.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 19, "product_name": "Tie & Dye Dupata", "quantity": 2, "price": 1800.00, "total": 3600.00},
        {"product_id": 29, "product_name": "Leather Wallet", "quantity": 1, "price": 2200.00, "total": 2200.00}
    ]'::jsonb,
    2,
    NOW() - INTERVAL '3 hours'
);

-- Transaction 9: Corporate bulk order
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0009',
    10,
    'Corporate Order',
    48000.00,
    5000.00,
    0,
    'Cash',
    'Pending',
    1,
    '[
        {"product_id": 1, "product_name": "Crochet Cardigan", "quantity": 5, "price": 4000.00, "total": 20000.00},
        {"product_id": 24, "product_name": "Embroidered Cushion Covers", "quantity": 6, "price": 3200.00, "total": 19200.00},
        {"product_id": 30, "product_name": "Brass Decorative Bowl", "quantity": 3, "price": 4200.00, "total": 12600.00}
    ]'::jsonb,
    1,
    NOW() - INTERVAL '1 hour'
);

-- Transaction 10: Recent small purchase
INSERT INTO transactions (ref_number, customer_id, customer_name, total_amount, discount, tax, payment_method, payment_status, status, items, user_id, created_at) VALUES
(
    'TXN-2025-0010',
    8,
    'Sara Iqbal',
    7500.00,
    0,
    0,
    'Cash',
    'Paid',
    1,
    '[
        {"product_id": 9, "product_name": "Cushions Set", "quantity": 1, "price": 7000.00, "total": 7000.00}
    ]'::jsonb,
    3,
    NOW() - INTERVAL '30 minutes'
);

-- =====================================================
-- Update product quantities based on transactions
-- =====================================================

-- Update quantities for sold products
UPDATE products SET quantity = quantity - 2 WHERE id = 1;  -- Crochet Cardigan (2 in txn1, 5 in txn9)
UPDATE products SET quantity = quantity - 5 WHERE id = 1;
UPDATE products SET quantity = quantity - 2 WHERE id = 4;  -- Hand Painted Lawn Dupatta
UPDATE products SET quantity = quantity - 1 WHERE id = 8;  -- Bed Set
UPDATE products SET quantity = quantity - 2 WHERE id = 9;  -- Cushions Set
UPDATE products SET quantity = quantity - 2 WHERE id = 12; -- Islamic Calligraphy large
UPDATE products SET quantity = quantity - 1 WHERE id = 13; -- Islamic Calligraphy medium
UPDATE products SET quantity = quantity - 1 WHERE id = 5;  -- Decorative Pots
UPDATE products SET quantity = quantity - 2 WHERE id = 16; -- Hand Painted Embellished Dupattas (Paper Cotton)
UPDATE products SET quantity = quantity - 2 WHERE id = 17; -- Hand Painted Embellished Dupattas (Organza)
UPDATE products SET quantity = quantity - 1 WHERE id = 22; -- Blue Pottery Vase
UPDATE products SET quantity = quantity - 1 WHERE id = 23; -- Blue Pottery Bowl Set
UPDATE products SET quantity = quantity - 1 WHERE id = 25; -- Blue Pottery Plate
UPDATE products SET quantity = quantity - 1 WHERE id = 26; -- Handcrafted Coffee Table
UPDATE products SET quantity = quantity - 1 WHERE id = 27; -- Wooden Wall Shelf
UPDATE products SET quantity = quantity - 1 WHERE id = 33; -- Silver Necklace Set
UPDATE products SET quantity = quantity - 1 WHERE id = 32; -- Silver Earrings
UPDATE products SET quantity = quantity - 2 WHERE id = 19; -- Tie & Dye Dupata
UPDATE products SET quantity = quantity - 1 WHERE id = 29; -- Leather Wallet
UPDATE products SET quantity = quantity - 6 WHERE id = 24; -- Embroidered Cushion Covers
UPDATE products SET quantity = quantity - 3 WHERE id = 30; -- Brass Decorative Bowl

-- =====================================================
-- SUMMARY
-- =====================================================
-- This seed data includes:
-- - 5 users (including default admin)
-- - 8 institutes across different zones
-- - 13 categories linked to institutes
-- - 33 products with realistic pricing and inventory
-- - 10 customers (including walk-in and corporate)
-- - 10 transactions with various payment methods
-- - Automatic quantity updates based on sales

SELECT 'Seed data inserted successfully!' AS status;