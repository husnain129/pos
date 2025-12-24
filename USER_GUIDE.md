# Creative Hands POS System - User Guide
**By TEVTA**  
**Created by: Mr. Zahid Ghaffar - Chief Instructor IT**

---

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Main Features](#main-features)
5. [Institute Management](#institute-management)
6. [Category Management](#category-management)
7. [Product Management](#product-management)
8. [Sales & Transactions](#sales--transactions)
9. [Reports & Analytics](#reports--analytics)
10. [Database Reset](#database-reset)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

Creative Hands POS (Point of Sale) System is a comprehensive inventory and sales management solution designed for TEVTA institutes across Punjab. The system manages multiple institutes, product categories, inventory, and sales transactions with detailed reporting capabilities.

### Key Features
- ✅ Multi-institute management
- ✅ Institute-specific product categories and inventory
- ✅ Real-time sales processing
- ✅ Comprehensive transaction reports with profit tracking
- ✅ User management with role-based permissions
- ✅ Export reports to CSV, Excel, and PDF
- ✅ Cost price and profit calculation
- ✅ Professional invoice generation

---

## Getting Started

### System Requirements
- Operating System: Windows 7/10/11, macOS, or Linux
- Database: PostgreSQL 10 or higher
- Node.js: Version 14 or higher
- RAM: Minimum 4GB
- Storage: 500MB free space

### First Time Setup

1. **Start the Application**
   - Double-click the application icon
   - Wait for the system to load

2. **Login**
   - **Default Username**: admin
   - **Default Password**: admin
   - Change the default password immediately after first login

3. **Configure Settings**
   - Navigate to Settings tab
   - Update company information
   - Set tax rates if applicable
   - Configure receipt preferences

---

## User Roles & Permissions

The system supports role-based access control with the following permissions:

### Administrator (Full Access)
- ✅ Manage all features
- ✅ Create and manage users
- ✅ Access all reports
- ✅ Manage settings
- ✅ Delete/modify all data

### Manager
- ✅ Manage products and inventory
- ✅ Manage categories
- ✅ Process sales
- ✅ View reports
- ❌ Cannot manage users
- ❌ Cannot modify system settings

### Sales Person
- ✅ Process sales transactions
- ✅ View product information
- ❌ Cannot modify inventory
- ❌ Cannot access reports
- ❌ Cannot manage users

### Permission Details

| Permission | Description |
|------------|-------------|
| **Manage Products and Stock** | Add, edit, delete products and update inventory levels |
| **Manage Product Categories** | Create and manage product categories and assign to institutes |
| **View Transactions** | Access sales history and transaction reports |
| **Manage Users and Permissions** | Create users, assign roles, and set permissions |
| **Manage Settings** | Modify system configuration and company information |

---

## Main Features

### Dashboard
The main dashboard displays:
- Institute filter dropdown
- Product list with current stock levels
- Quick access to all management tabs
- Real-time user information and timestamp

### Navigation Tabs
1. **Products** - Manage inventory
2. **Categories** - Organize products
3. **Institutes** - Manage institute information
4. **Transactions** - View sales history
5. **Customers** - Manage customer database
6. **Users** - User account management
7. **Settings** - System configuration

---

## Institute Management

### Adding a New Institute

1. Click the **Institutes** tab
2. Click **Add New Institute** button
3. Fill in the form:
   - **Institute Name**: Full name (e.g., "GVTI(W) Sahiwal")
   - **District**: District location
   - **Zone**: Select from North, South, or Center
4. Click **Save Institute**

### Viewing Institutes

- All institutes are displayed in a table with:
  - Institute Name
  - District
  - Zone
  - Action buttons (Edit/Delete)

### Editing an Institute

1. Click the **Edit** button next to the institute
2. Update the information
3. Click **Save Institute**

### Deleting an Institute

⚠️ **Warning**: Deleting an institute will also delete:
- All categories linked to that institute
- All products linked to that institute
- Associated transaction history

1. Click the **Delete** button
2. Confirm the deletion

---

## Category Management

Categories are linked to specific institutes for better organization.

### Adding a New Category

1. Click the **Categories** tab
2. Click **Add Category** button
3. Fill in the form:
   - **Category Name**: Descriptive name (e.g., "Textile Design")
   - **Institute**: Select the institute this category belongs to
4. Click **Save Category**

### Institute-Based Filtering

Categories automatically filter based on the selected institute on the main dashboard. This ensures users only see relevant categories for their institute.

### Editing a Category

1. Click the **Edit** button next to the category
2. Update the name or linked institute
3. Click **Save Category**

### Deleting a Category

⚠️ **Warning**: Deleting a category will remove it from all associated products.

1. Click the **Delete** button
2. Confirm the deletion

---

## Product Management

### Adding a New Product

1. Click the **Products** tab
2. Click **Add Product** button
3. Fill in the product form:

| Field | Description | Required |
|-------|-------------|----------|
| **Institute** | Select the institute | Yes |
| **Zone** | Automatically filled based on institute | Auto |
| **District** | Automatically filled based on institute | Auto |
| **Product Name** | Name of the product | Yes |
| **Category** | Product category (filtered by institute) | Yes |
| **Specifications** | Product details/description | No |
| **Quantity** | Current stock quantity | Yes |
| **Cost Price** | Price you paid (for profit calculation) | Yes |
| **Sale Price** | Price you sell for | Yes |
| **Barcode** | Barcode number (optional) | No |
| **Image Link** | URL to product image | No |

4. Click **Save Product**

### Institute and Category Filtering

When you select an institute:
- The zone and district fields auto-populate
- The category dropdown shows only categories for that institute
- This ensures data consistency

### Viewing Products

Products are displayed in a searchable table showing:
- Product Image (if available)
- Product Name
- Institute Name
- Category
- Specifications
- Stock Quantity
- Cost Price
- Sale Price
- Action buttons

### Editing a Product

1. Click the **Edit** button next to the product
2. Update any information
3. Categories will filter based on the selected institute
4. Click **Save Product**

### Deleting a Product

1. Click the **Delete** button
2. Confirm the deletion

### Stock Management

- **Low Stock Warning**: Products with quantity ≤ 5 show a warning icon
- **Out of Stock**: Products with quantity = 0 display "Out of Stock"
- Update stock levels when receiving new inventory

---

## Sales & Transactions

### Processing a Sale

1. **Filter by Institute** (optional)
   - Select institute from the top filter dropdown
   - Products and categories will filter accordingly

2. **Search for Products**
   - Use the search bar to find products
   - Or browse through categories

3. **Add to Cart**
   - Click on a product to add it to the cart
   - Quantity defaults to 1

4. **Adjust Quantities**
   - Use +/- buttons to adjust quantities
   - Or type the quantity directly

5. **Remove Items**
   - Click the trash icon to remove an item from cart

6. **Review Cart**
   - Cart displays:
     - Product name
     - Unit price
     - Quantity
     - Total price per item
   - Bottom shows:
     - Subtotal
     - Tax (if configured)
     - Grand Total

7. **Complete Sale**
   - Click **Pay** or **Checkout** button
   - Select payment method:
     - Cash
     - Card
     - Mobile Payment
   - Print receipt (optional)

### Receipt/Invoice

Generated receipts include:
- Creative Hands logo
- Company name and "By TEVTA" tagline
- Transaction date and time
- Product list with quantities and prices
- Subtotal, tax, and total
- Payment method
- Footer with creator information

---

## Reports & Analytics

### Transaction Reports

1. Click the **Transactions** tab
2. Use the date range picker to select a period
3. Click **Load Transactions**

### Report Details

The transaction report shows:
- Transaction ID
- Date & Time
- Institute Name
- Category
- Product Name
- Quantity Sold
- Unit Price
- Unit Cost
- Total Revenue
- Total Cost
- Profit (Revenue - Cost)
- Profit Percentage

### Filtering Reports

- **By Institute**: Select an institute from the main dashboard filter
- **By Date Range**: Use the date picker
  - Today
  - Yesterday
  - Last 7 Days
  - Last 30 Days
  - This Month
  - Last Month
  - Custom Range

### Exporting Reports

The system supports three export formats:

#### 1. CSV Export
- Click **CSV** button
- Opens in Excel or any spreadsheet application
- Best for further data analysis

#### 2. Excel Export
- Click **Excel** button
- Downloads as .xlsx file
- Preserves formatting

#### 3. PDF Export
- Click **PDF** button
- Professional format for printing
- Includes all branding and formatting

### Profit Analysis

Reports calculate profit automatically:
- **Profit** = (Sale Price × Quantity) - (Cost Price × Quantity)
- **Profit %** = (Profit / Total Cost) × 100

This helps you understand:
- Which products are most profitable
- Which institutes generate most revenue
- Which categories perform best

---

## Database Reset

### When to Reset the Database

You may need to reset the database to:
- Clear test data before going live
- Start a new financial year
- Remove corrupted data
- Return to clean state

⚠️ **WARNING**: This action is IRREVERSIBLE and will delete:
- All transactions and sales history
- All products and inventory
- All categories
- All institutes
- All customers
- All settings

✅ **User accounts will be preserved** - you can still log in after reset.

### How to Reset the Database

#### Method 1: Using the Reset Script (Recommended)

1. **Close the POS Application** completely

2. **Open Terminal/Command Prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - macOS: Press `Cmd + Space`, type `terminal`, press Enter

3. **Navigate to Application Folder**
   ```bash
   cd /path/to/Store-POS
   ```

4. **Run the Reset Script**
   ```bash
   node reset_database.js
   ```

5. **Confirm the Action**
   - Type `yes` when prompted
   - Wait for confirmation message

6. **Restart the Application**

#### Method 2: Using Database Client

1. Open your PostgreSQL client (pgAdmin, DBeaver, etc.)
2. Connect to your database
3. Open the file: `db/reset_and_import_data.sql`
4. Execute the SQL script
5. Restart the application

### After Reset

The database will contain sample data:
- 7 sample institutes
- 8 sample categories
- 17 sample products
- No transactions

You can then:
- Add your actual institutes
- Create your categories
- Import your products
- Begin processing sales

---

## Troubleshooting

### Common Issues and Solutions

#### Cannot Login

**Problem**: "Incorrect username or password" error

**Solutions**:
1. Check caps lock is off
2. Verify username and password
3. Default credentials: admin / admin
4. Contact administrator to reset password

---

#### Products Not Showing

**Problem**: Product list is empty or filtered incorrectly

**Solutions**:
1. Check institute filter - select "All Institutes"
2. Clear search box
3. Verify products exist in database
4. Check if user has permission to view products

---

#### Categories Not Showing in Product Form

**Problem**: Category dropdown is empty when adding product

**Solutions**:
1. Ensure you've selected an institute first
2. Verify categories exist for that institute
3. Add categories for the institute if none exist

---

#### Reports Not Generating

**Problem**: Transaction report shows no data

**Solutions**:
1. Verify date range includes transactions
2. Check institute filter setting
3. Ensure transactions exist in the system
4. Try selecting "All time" date range

---

#### Database Connection Error

**Problem**: "Cannot connect to database" on startup

**Solutions**:
1. Verify PostgreSQL is running
2. Check database credentials in `db/config.js`
3. Ensure database exists
4. Check firewall settings
5. Verify port 8001 is available

---

#### Print Receipt Not Working

**Problem**: Receipt doesn't print or preview

**Solutions**:
1. Check printer is connected and online
2. Try "Print Preview" first
3. Verify browser print settings
4. Check if popup blocker is enabled
5. Try using PDF export instead

---

#### Export Buttons Not Working

**Problem**: CSV/Excel/PDF export fails

**Solutions**:
1. Check popup blocker settings
2. Ensure browser allows downloads
3. Try different export format
4. Check available disk space
5. Verify browser compatibility

---

#### Profit Showing Incorrectly

**Problem**: Profit calculations seem wrong

**Solutions**:
1. Verify cost price is entered for all products
2. Check sale price is correct
3. Ensure quantities are accurate
4. Cost price must be less than sale price for profit

---

### Getting Help

If you encounter issues not covered here:

1. **Check Error Messages**: Note any error messages displayed
2. **Check Console**: Press F12, look for errors in Console tab
3. **Restart Application**: Close and reopen the application
4. **Contact Support**: Reach out to Mr. Zahid Ghaffar (Chief Instructor IT)

---

## Best Practices

### Daily Operations

- [ ] Start the application at beginning of shift
- [ ] Verify all printers are working
- [ ] Check stock levels for popular items
- [ ] Process sales accurately
- [ ] Print receipts for all transactions
- [ ] Log out at end of shift

### Weekly Tasks

- [ ] Review transaction reports
- [ ] Check low stock items
- [ ] Update product prices if needed
- [ ] Backup database
- [ ] Review profit margins

### Monthly Tasks

- [ ] Export full month reports
- [ ] Analyze sales by institute
- [ ] Review top-selling products
- [ ] Update inventory levels
- [ ] Archive old transaction reports

### Security Best Practices

1. **User Accounts**
   - Use strong passwords
   - Change default passwords immediately
   - Don't share login credentials
   - Create separate accounts for each user

2. **Data Protection**
   - Regular database backups
   - Keep backups in secure location
   - Test backup restoration periodically

3. **System Updates**
   - Keep application updated
   - Update Node.js and PostgreSQL
   - Apply security patches promptly

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Open Developer Console |
| `Ctrl/Cmd + F` | Search products |
| `Ctrl/Cmd + P` | Print receipt |
| `ESC` | Close modal dialogs |

---

## Appendix

### Database Tables

1. **institutes** - Institute information
2. **categories** - Product categories linked to institutes
3. **products** - Product inventory with cost and price
4. **transactions** - Sales history
5. **customers** - Customer database
6. **users** - User accounts and permissions
7. **settings** - System configuration

### File Structure

```
Store-POS/
├── api/               # Backend API endpoints
├── assets/            # Frontend assets (CSS, JS, images)
├── db/                # Database scripts and configuration
├── index.html         # Main application interface
├── server.js          # Backend server
├── start.js           # Electron main process
├── reset_database.js  # Database reset utility
├── USER_GUIDE.md      # This guide
└── package.json       # Dependencies and scripts
```

---

## Support & Contact

**System Developer**: Mr. Zahid Ghaffar  
**Title**: Chief Instructor IT  
**Organization**: Creative Hands By TEVTA

For technical support, feature requests, or training:
- Contact your institute administrator
- Refer to this guide for common issues
- Keep this guide accessible for all users

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial release with full functionality |

---

**© 2025 Creative Hands By TEVTA. All rights reserved.**

*This system was developed to support TEVTA institutes across Punjab in managing their inventory and sales operations efficiently. We hope it serves you well in your mission to empower through skill development.*
