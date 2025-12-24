# Creative Hands POS - Quick Build Guide

## Build Commands

### macOS
```bash
npm run build:mac
```
Output: `release-builds/Creative Hands POS-darwin-x64/`

### Windows
```bash
npm run build:win
```
Output: `release-builds/Creative Hands POS-win32-x64/`

### Linux
```bash
npm run build:linux
```
Output: `release-builds/Creative Hands POS-linux-x64/`

### All Platforms
```bash
npm run build
```

## Configuration Files (Auto-created on first launch)

### macOS
- Database: `~/Library/Application Support/Creative Hands POS/database.json`
- Uploads: `~/Library/Application Support/Creative Hands POS/uploads/`

### Windows
- Database: `%APPDATA%\Creative Hands POS\database.json`
- Uploads: `%APPDATA%\Creative Hands POS\uploads\`

### Linux
- Database: `~/.creative-hands-pos/database.json`
- Uploads: `~/.creative-hands-pos/uploads/`

## Database Configuration Format

```json
{
  "host": "localhost",
  "port": 5432,
  "database": "pos",
  "user": "your_username",
  "password": "your_password"
}
```

## Cross-Platform Features

✅ Automatic platform detection  
✅ OS-specific data directories  
✅ Cross-platform file paths  
✅ Windows/macOS/Linux support  
✅ Network database support  

## Installation Guides

- **Windows**: See [WINDOWS_SETUP.md](WINDOWS_SETUP.md)
- **Build Process**: See [BUILD_GUIDE.md](BUILD_GUIDE.md)
- **User Manual**: See [USER_GUIDE.md](USER_GUIDE.md)

## Quick Test

1. **Build**: `npm run build:win` (or build:mac)
2. **Install**: Copy executable to desired location
3. **Launch**: Run the app - it will create config files
4. **Configure**: Edit `database.json` with your credentials
5. **Restart**: Relaunch the app

---

© 2025 Creative Hands By TEVTA
