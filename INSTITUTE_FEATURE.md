# Institute Feature Setup Instructions

## Database Migration

Run the following command to add the institutes table and update the categories table:

```bash
psql "postgresql://muhammadh.:@localhost:5432/pos" -f db/add_institutes.sql
```

## Features Added:

### 1. **Institutes Management**
   - New "Institutes" button added to the dashboard
   - Add, edit, and delete institutes
   - Institute fields: Name, District, Zone

### 2. **Categories Linked to Institutes**
   - Categories now have an institute dropdown
   - Each category can belong to one institute
   - Existing categories work without an institute (optional)

### 3. **Product Filtering by Institute**
   - Institute dropdown filter added above products display
   - Filter shows "All Institutes" by default
   - Products are filtered based on their category's institute
   - Only products from categories of the selected institute are shown

### 4. **Dashboard Integration**
   - Products now show which institute they belong to (via their category)
   - Institute filter helps organize products by institution

## How to Use:

1. **Add Institutes**: Click the Institutes button, then the + button
2. **Create Categories with Institutes**: When creating/editing categories, select an institute
3. **Filter Products**: Use the institute dropdown above the products to filter by institute
4. **View Institute Info**: The Institutes modal shows all institutes with their district and zone

## Files Modified:
- `api/institutes.js` - New API for institute operations
- `server.js` - Added institutes route
- `index.html` - Added institute UI components
- `assets/js/pos.js` - Added institute JavaScript functions
- `api/categories.js` - Updated to handle institute_id
- `db/add_institutes.sql` - Database migration script
