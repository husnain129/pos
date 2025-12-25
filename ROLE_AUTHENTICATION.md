# Role-Based Authentication System

## Overview
The POS system now supports role-based authentication with two main roles:
- **Administrator**: Full access to all features
- **Cashier**: Limited access - can process sales but cannot manage products, categories, or institutes

## User Roles

### Administrator
- Can add/edit/delete products
- Can add/edit/delete categories
- Can add/edit/delete institutes
- Can manage users (add cashiers)
- Can view transactions
- Can modify settings

### Cashier
- Can process sales (Point of Sale)
- Can view transactions
- **Cannot** add/edit/delete products
- **Cannot** add/edit/delete categories
- **Cannot** add/edit/delete institutes
- **Cannot** manage other users
- **Cannot** modify settings

## Setup

### 1. Database Setup
Run the role migration script:
```bash
psql -U postgres -d pos -f db/add_roles.sql
```

### 2. Default Credentials

**Administrator:**
- Username: `admin`
- Password: `admin`

**Sample Cashier:**
- Username: `cashier`
- Password: `cashier123`

### 3. Adding New Users

Administrators can add new cashiers:
1. Click the user icon button in the top right
2. Click "Add User" or similar button
3. Fill in the user details
4. Select role: "Cashier" or "Administrator"
5. Set permissions (optional, role takes precedence)
6. Save

## Features

### UI Restrictions for Cashiers
- "Add" buttons (+ icons) are hidden for Products, Categories, and Institutes
- Institutes section is completely hidden
- Edit/Delete buttons are disabled (attempts show "Access Denied" message)

### Security
- Passwords are encoded using btoa (base64)
- Role is verified on both client and server side
- User role is stored in session storage
- All edit/delete operations check user role before execution

## Testing

1. **Login as Administrator:**
   - Use `admin` / `admin`
   - Verify you can see all buttons and features
   - Try adding a new product, category, or institute

2. **Add a Cashier:**
   - While logged in as admin, add a new cashier user
   - Set role to "Cashier"
   - Save the user

3. **Login as Cashier:**
   - Logout and login with cashier credentials
   - Verify:
     - No "+" buttons appear next to Products, Categories
     - Institutes section is hidden
     - Clicking edit/delete shows "Access Denied"
     - Point of Sale and Transactions are accessible

## Implementation Details

### Modified Files
1. **assets/js/pos.js**
   - Added role checking on login
   - Added UI restrictions based on role
   - Added access control to edit/delete functions

2. **api/users.js**
   - Returns role in login response
   - Accepts role in user creation

3. **index.html**
   - Added role dropdown to user form

4. **db/add_roles.sql**
   - Migration script for role setup

### Role Storage
- Role is stored in the `auth` object in electron-store
- Role is also stored in the `user` object
- Both are checked to ensure consistency

## Troubleshooting

### Issue: Cashier can still see edit buttons
**Solution:** Clear application cache and restart
- Close the application
- Delete electron-store cache
- Restart and login again

### Issue: Cannot login with default credentials
**Solution:** Check database
```sql
SELECT username, role FROM users;
```
Ensure the admin user exists with role 'administrator'

### Issue: Role dropdown not showing
**Solution:** Check if you're logged in as administrator
- Only administrators can add users
- The role dropdown appears when adding a new user

## Future Enhancements
- Add more granular permissions
- Add "Manager" role with intermediate permissions
- Add audit logging for all user actions
- Add password strength requirements
- Add session timeout
