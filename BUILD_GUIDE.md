# Creative Hands POS - Build & Installation Guide

**By TEVTA**  
**Created by: Mr. Zahid Ghaffar - Chief Instructor IT**

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Running in Development Mode](#running-in-development-mode)
5. [Building the Application](#building-the-application)
6. [Installation](#installation)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **PostgreSQL** (v10 or higher)
   - **macOS**: Download from https://www.postgresql.org/download/macosx/
   - **Windows**: Download from https://www.postgresql.org/download/windows/
   - **Linux**: 
     ```bash
     sudo apt-get install postgresql postgresql-contrib
     ```
   - Verify installation:
     ```bash
     psql --version
     ```

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/downloads

---

## Initial Setup

### Step 1: Get the Source Code

If you have the project folder, skip to Step 2. Otherwise:

```bash
cd /path/to/your/projects
git clone <repository-url>
cd Store-POS
```

### Step 2: Install Dependencies

Open Terminal (macOS/Linux) or Command Prompt (Windows):

```bash
cd /Users/muhammadh./Desktop/projects/pos/Store-POS
npm install
```

This will install all required packages. It may take 2-5 minutes.

**Expected Output:**
```
added 500+ packages in 3m
```

### Step 3: Fix Dependencies (if needed)

If you see any warnings about vulnerabilities or deprecated packages:

```bash
npm audit fix
```

---

## Database Setup

### Step 1: Create PostgreSQL Database

1. **Open PostgreSQL Command Line**
   
   **macOS/Linux:**
   ```bash
   psql postgres
   ```
   
   **Windows:**
   - Search for "SQL Shell (psql)" in Start Menu
   - Press Enter for default values
   - Enter your password

2. **Create Database and User**
   
   ```sql
   CREATE DATABASE pos_db;
   CREATE USER pos_user WITH ENCRYPTED PASSWORD 'your_password_here';
   GRANT ALL PRIVILEGES ON DATABASE pos_db TO pos_user;
   \q
   ```

### Step 2: Configure Database Connection

1. Open the file: `db/config.js`

2. Update with your database credentials:
   ```javascript
   module.exports = {
     host: 'localhost',
     port: 5432,
     database: 'pos_db',
     user: 'pos_user',
     password: 'your_password_here'
   };
   ```

### Step 3: Initialize Database Schema

```bash
psql -U pos_user -d pos_db -f db/schema.sql
```

Enter your password when prompted.

### Step 4: Import Sample Data (Optional)

```bash
psql -U pos_user -d pos_db -f db/reset_and_import_data.sql
```

Or use the reset script:
```bash
node reset_database.js
```

---

## Running in Development Mode

To test the application before building:

```bash
npm start
```

Or for auto-reload during development:
```bash
npm run dev
```

**Expected Result:**
- Server starts on port 8001
- Electron window opens with the POS interface
- You can log in with default credentials: admin / admin

**To Stop:**
- Close the Electron window, or
- Press `Ctrl+C` in the terminal

---

## Building the Application

Building creates a standalone executable that can be installed on computers without Node.js.

### Before Building

1. **Ensure Database is Set Up** - The app needs PostgreSQL
2. **Test in Development Mode** - Run `npm start` to verify everything works
3. **Update Version** - Edit `package.json` to update version number if needed

### Build Commands

#### Build for Your Current Platform (Recommended)

**On macOS:**
```bash
npm run build:mac
```

**On Windows:**
```bash
npm run build:win
```

**On Linux:**
```bash
npm run build:linux
```

#### Build for All Platforms (requires platform-specific tools)

```bash
npm run build
```

⚠️ **Note**: Cross-platform building has limitations:
- Windows builds work best on Windows
- macOS builds require a Mac (due to code signing)
- Linux builds work on Linux or macOS

### Build Output

After building, you'll find the installers in the `dist` folder:

```
dist/
├── Creative Hands POS-0.1.0.dmg          # macOS installer
├── Creative Hands POS Setup 0.1.0.exe    # Windows installer
└── creative-hands-pos_0.1.0_amd64.deb    # Linux installer
```

### Build Time

- First build: 5-10 minutes
- Subsequent builds: 2-5 minutes

---

## Installation

### macOS Installation

1. Locate the `.dmg` file in the `dist` folder
2. Double-click the `.dmg` file
3. Drag "Creative Hands POS" to the Applications folder
4. Open Applications folder and double-click "Creative Hands POS"
5. If you see a security warning:
   - Go to System Preferences → Security & Privacy
   - Click "Open Anyway"

### Windows Installation

1. Locate the `.exe` file in the `dist` folder
2. Double-click the installer
3. Follow the installation wizard
4. If Windows Defender shows a warning, click "More info" → "Run anyway"
5. Find "Creative Hands POS" in your Start Menu

### Linux Installation

**For .deb (Debian/Ubuntu):**
```bash
sudo dpkg -i dist/creative-hands-pos_0.1.0_amd64.deb
sudo apt-get install -f  # Install dependencies if needed
```

**For .AppImage:**
```bash
chmod +x dist/Creative-Hands-POS-0.1.0.AppImage
./dist/Creative-Hands-POS-0.1.0.AppImage
```

---

## Post-Installation Setup

### 1. Database Configuration

The installed app still needs PostgreSQL. On the target computer:

1. Install PostgreSQL (see Prerequisites)
2. Create the database (see Database Setup)
3. Update `db/config.js` with local database credentials

**Finding db/config.js after installation:**
- **macOS**: Right-click app → Show Package Contents → Resources → app → db
- **Windows**: C:\Users\YourName\AppData\Local\Programs\creative-hands-pos\resources\app\db
- **Linux**: /opt/Creative Hands POS/resources/app/db

### 2. First Launch

1. Launch the application
2. Log in with default credentials:
   - **Username**: admin
   - **Password**: admin
3. Change the admin password immediately:
   - Go to Users tab
   - Edit admin user
   - Set a strong password

### 3. Import Your Data

If you have existing data:

```bash
# Navigate to the installation directory
cd /path/to/installed/app/resources/app
node reset_database.js
```

Or manually import via PostgreSQL client.

---

## Distribution

### For Single Computer

Simply install using the installer as described above.

### For Multiple Computers (Network Setup)

1. **Set up PostgreSQL Server** on one computer
   - Configure to accept network connections
   - Edit `postgresql.conf`: `listen_addresses = '*'`
   - Edit `pg_hba.conf`: Add network access rules

2. **Install Application** on all computers

3. **Configure Database Connection** on each computer
   - Update `db/config.js` to point to the server's IP address:
   ```javascript
   module.exports = {
     host: '192.168.1.100',  // Server IP
     port: 5432,
     database: 'pos_db',
     user: 'pos_user',
     password: 'your_password'
   };
   ```

---

## Troubleshooting

### Build Errors

#### Error: "electron is only allowed in devDependencies"

**Solution**: Already fixed in package.json. If you see this, run:
```bash
npm install
npm run build:mac  # or build:win or build:linux
```

#### Error: "Cannot find module 'electron'"

**Solution**:
```bash
npm install electron --save-dev
npm run build:mac
```

#### Error: "EACCES: permission denied"

**Solution** (macOS/Linux):
```bash
sudo npm install
```

Or fix npm permissions:
```bash
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) /path/to/Store-POS
```

### Runtime Errors

#### "Cannot connect to database"

**Solution**:
1. Verify PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_ctl status
   
   # Windows
   # Check Services for PostgreSQL
   ```

2. Test connection:
   ```bash
   psql -U pos_user -d pos_db -h localhost
   ```

3. Check credentials in `db/config.js`

#### "Port 8001 already in use"

**Solution**:
1. Find the process:
   ```bash
   # macOS/Linux
   lsof -i :8001
   
   # Windows
   netstat -ano | findstr :8001
   ```

2. Kill the process or change the port in `server.js`

#### "App crashes on launch"

**Solution**:
1. Check console for errors:
   - macOS: Applications → Utilities → Console
   - Windows: Event Viewer
   - Linux: Check journal: `journalctl -xe`

2. Try running from terminal to see errors:
   ```bash
   # macOS
   /Applications/Creative\ Hands\ POS.app/Contents/MacOS/Creative\ Hands\ POS
   
   # Windows
   "C:\Program Files\Creative Hands POS\Creative Hands POS.exe"
   ```

### Installation Issues

#### macOS: "App is damaged and can't be opened"

**Solution**:
```bash
xattr -cr /Applications/Creative\ Hands\ POS.app
```

#### Windows: "Windows protected your PC"

**Solution**:
- Click "More info"
- Click "Run anyway"
- This happens because the app isn't code-signed

#### Linux: Missing dependencies

**Solution**:
```bash
sudo apt-get install -f
```

---

## Updating the Application

### To Update an Existing Installation:

1. Build new version with updated version number
2. Uninstall old version (or install over it)
3. Install new version
4. Database and settings are preserved

### To Update Database Schema:

1. Back up existing database:
   ```bash
   pg_dump -U pos_user pos_db > backup.sql
   ```

2. Apply schema changes:
   ```bash
   psql -U pos_user -d pos_db -f db/schema.sql
   ```

---

## Advanced Configuration

### Custom App Icon

1. Replace `assets/images/icon.ico` (Windows) or `assets/images/icon.icns` (macOS)
2. Rebuild the application

### Custom Installer Name

Edit `package.json`:
```json
"build": {
  "appId": "com.creativehands.pos",
  "productName": "Creative Hands POS",
  "directories": {
    "buildResources": "assets",
    "output": "dist"
  }
}
```

### Code Signing (for distribution)

For macOS:
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password
npm run build:mac
```

For Windows:
```bash
set CSC_LINK=C:\path\to\certificate.pfx
set CSC_KEY_PASSWORD=your_password
npm run build:win
```

---

## System Requirements

### Development Machine

- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space
- **OS**: macOS 10.13+, Windows 10+, Ubuntu 18.04+

### Production/End-User Machine

- **RAM**: 4GB minimum
- **Storage**: 500MB free space
- **OS**: macOS 10.13+, Windows 7+, Ubuntu 16.04+
- **Database**: PostgreSQL 10+ (can be on separate server)

---

## Deployment Checklist

Before deploying to production:

- [ ] Test all features in development mode
- [ ] Update version number in package.json
- [ ] Change default admin password
- [ ] Configure database with production credentials
- [ ] Test database backup and restore
- [ ] Build installers for target platforms
- [ ] Test installation on clean machines
- [ ] Document database server location for network setups
- [ ] Train users on the system
- [ ] Provide USER_GUIDE.md to all users

---

## Getting Help

For build or installation issues:

1. Check this guide's Troubleshooting section
2. Review the error messages carefully
3. Check terminal/console output
4. Verify all prerequisites are installed
5. Contact: Mr. Zahid Ghaffar (Chief Instructor IT)

---

## Quick Reference

```bash
# Install dependencies
npm install

# Run in development
npm start

# Build for macOS
npm run build:mac

# Build for Windows
npm run build:win

# Build for Linux
npm run build:linux

# Reset database
node reset_database.js
```

---

**© 2025 Creative Hands By TEVTA. All rights reserved.**

*Good luck with your deployment!*
