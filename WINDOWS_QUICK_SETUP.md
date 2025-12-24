# Creative Hands POS - Quick Windows Setup

## Problem: Login Error on Windows

The error means the app can't connect to the database. Follow these steps:

### Step 1: Install PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Install (remember the password you set)
3. Default port: 5432

### Step 2: Create Database
Open **pgAdmin** (installed with PostgreSQL):
1. Right-click **Databases** → **Create** → **Database**
2. Name: `pos`
3. Click **Save**

### Step 3: Setup Database Configuration

**Option A - Automatic (Recommended):**
1. Double-click `setup-database-windows.bat`
2. Enter your PostgreSQL details
3. Done!

**Option B - Manual:**
1. Press `Win + R`, type: `%APPDATA%\Creative Hands POS`
2. Create file: `database.json`
3. Paste this content (update password):
```json
{
  "host": "localhost",
  "port": 5432,
  "database": "pos",
  "user": "postgres",
  "password": "YOUR_POSTGRES_PASSWORD"
}
```

### Step 4: Import Database Schema

**Using pgAdmin:**
1. Open **pgAdmin**
2. Select database `pos`
3. Click **Query Tool** (thunder icon)
4. Click folder icon, open: `db\schema.sql`
5. Press **F5** to execute

**Using Command Line:**
```cmd
psql -U postgres -d pos -f db\schema.sql
```

### Step 5: Start the Application
- Double-click **Creative Hands POS.exe**
- Login with:
  - Username: `admin`
  - Password: `admin`

---

## Quick Troubleshooting

### "Cannot connect to database"
✅ Check PostgreSQL is running (Services → postgresql)  
✅ Verify database name is `pos`  
✅ Check password in `database.json`

### "Login 500 Error"
✅ Make sure database schema is imported  
✅ Check `%APPDATA%\Creative Hands POS\database.json` exists  
✅ Verify postgres service is running

### Find Config File
```cmd
explorer %APPDATA%\Creative Hands POS
```

### Test Database Connection
```cmd
psql -U postgres -d pos
```

---

**Support:** Mr. Zahid Ghaffar - Chief Instructor IT  
**Email:** admin@creativehands.com
