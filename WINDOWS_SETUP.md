# Windows Installation Guide - Creative Hands POS

## For Windows Users

### Prerequisites
1. **PostgreSQL** - Download and install from https://www.postgresql.org/download/windows/
   - During installation, remember your postgres password
   - Default port: 5432

2. **Create Database**
   - Open pgAdmin (installed with PostgreSQL)
   - Right-click "Databases" → Create → Database
   - Name it: `pos`
   - Click Save

3. **Run Database Schema**
   - Open SQL Query tool in pgAdmin
   - Open file: `db/schema.sql`
   - Execute the script (press F5)

4. **Import Sample Data (Optional)**
   - Open file: `db/reset_and_import_data.sql`
   - Execute the script

### Installation Steps

1. **Download the Application**
   - Get `Creative Hands POS-win32-x64` folder from release-builds
   - Or run `npm run build:win` to build it yourself

2. **Copy to Program Files**
   ```
   Copy "Creative Hands POS-win32-x64" folder to:
   C:\Program Files\Creative Hands POS\
   ```

3. **Create Shortcut**
   - Right-click `Creative Hands POS.exe`
   - Send to → Desktop (create shortcut)

4. **First Launch**
   - Double-click the shortcut
   - The app will create a config file at:
     `C:\Users\YourName\AppData\Roaming\Creative Hands POS\database.json`

5. **Configure Database**
   - Press `Win + R`, type: `%APPDATA%\Creative Hands POS`
   - Edit `database.json`:
   ```json
   {
     "host": "localhost",
     "port": 5432,
     "database": "pos",
     "user": "postgres",
     "password": "your_postgres_password"
   }
   ```
   - Save and restart the app

### Default Login
- **Username**: admin
- **Password**: admin

⚠️ **Change the password immediately after first login!**

### Troubleshooting

#### "Cannot connect to database"
1. Check PostgreSQL is running (Services → postgresql)
2. Verify database name is `pos`
3. Check credentials in `database.json`
4. Test connection in pgAdmin

#### "Application won't start"
1. Install Visual C++ Redistributable: https://aka.ms/vs/17/release/vc_redist.x64.exe
2. Run as Administrator
3. Check Windows Firewall settings

#### Upload/Image Issues
- Images are stored in: `C:\Users\YourName\AppData\Roaming\Creative Hands POS\uploads`
- Ensure the folder exists and has write permissions

### Network Setup (Multiple Computers)

1. **On Database Server:**
   - Open pgAdmin → PostgreSQL → right-click → Properties
   - Listen Addresses: Change to `*`
   - Edit `pg_hba.conf`:
   ```
   host    all    all    0.0.0.0/0    md5
   ```
   - Restart PostgreSQL service

2. **On Client Computers:**
   - Edit `database.json`:
   ```json
   {
     "host": "192.168.1.100",  // Server IP
     "port": 5432,
     "database": "pos",
     "user": "postgres",
     "password": "your_password"
   }
   ```

### Firewall Configuration

Open Windows Firewall, create inbound rules for:
- Port 5432 (PostgreSQL)
- Port 8001 (POS Application)

---

**Support**: Mr. Zahid Ghaffar - Chief Instructor IT  
**Organization**: Creative Hands By TEVTA
