# Build Single Portable EXE File

This guide explains how to create a single shareable portable EXE file for Creative Hands POS that can run on any Windows machine without installation.

## What is a Portable EXE?

A portable EXE is a self-contained executable file that:
- **No installation required** - Just run the EXE file
- **Includes all dependencies** - Everything bundled in one package
- **Portable** - Can run from USB drives or any folder
- **No admin rights needed** - User-level permissions only
- **All files in one place** - Creates a folder next to the EXE with all resources

## Prerequisites

Before building, ensure you have:

1. **Node.js** (v14 or higher)
   ```bash
   node --version
   npm --version
   ```

2. **All dependencies installed**
   ```bash
   npm install
   ```

## Building the Portable EXE

### Step 1: Clean Previous Builds (Optional)

Remove previous build outputs:
```bash
# macOS/Linux
rm -rf dist

# Windows
rmdir /s /q dist
```

### Step 2: Build the Portable EXE

Run the build command:
```bash
npm run build:portable
```

Or use the main build command:
```bash
npm run build
```

### Step 3: Locate the Output

After the build completes (may take 5-10 minutes), find your portable EXE at:
```
dist/Creative Hands POS-Portable.exe
```

The file size will be approximately 200-400 MB.

## Build Configuration

The build is configured in two places:

### 1. package.json
```json
{
  "build": {
    "win": {
      "target": ["portable"],
      "icon": "assets/images/icon.ico"
    },
    "portable": {
      "artifactName": "${productName}-Portable.exe"
    }
  }
}
```

### 2. electron-builder.yml
Contains additional build settings for the portable executable.

## Using the Portable EXE

### For End Users:

1. **Copy the EXE** - Copy `Creative Hands POS-Portable.exe` to any location
2. **Run the EXE** - Double-click to launch
3. **First Run** - The app will extract files to a folder (first run only)
4. **Data Storage** - All data is stored in the extracted folder

### Distribution:

1. Share the single EXE file
2. Can be uploaded to cloud storage (Google Drive, Dropbox, etc.)
3. Can be put on USB drives for distribution
4. Users just need to download and run

## Troubleshooting

### Build Fails

If the build fails:

1. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Clear electron-builder cache**:
   ```bash
   # macOS/Linux
   rm -rf ~/Library/Caches/electron-builder
   
   # Windows
   rmdir /s /q %LOCALAPPDATA%\electron-builder\Cache
   ```

3. **Try again**:
   ```bash
   npm run build:portable
   ```

### Large File Size

The portable EXE is large because it includes:
- Electron framework (~150MB)
- Node.js runtime
- All your app files
- All dependencies

This is normal for Electron portable apps.

### Antivirus Warnings

Some antivirus software may flag the portable EXE as suspicious:
- This is a false positive
- It happens because portable EXEs self-extract
- You may need to add an exception in your antivirus

### Performance Issues

First launch may be slower because the app needs to extract files.
Subsequent launches will be faster.

## Advanced Configuration

### Customize Output Name

Edit `electron-builder.yml`:
```yaml
portable:
  artifactName: "MyCustomName-Portable.exe"
```

### Add Splash Screen

To add a splash screen, edit `electron-builder.yml`:
```yaml
win:
  splashScreen:
    imageFile: "assets/images/splash.png"
```

### Reduce File Size

To reduce the portable EXE size:

1. Remove unused dependencies from `package.json`
2. Exclude unnecessary files in `electron-builder.yml`:
   ```yaml
   files:
     - "**/*"
     - "!screenshots/**"
     - "!documentation/**"
   ```

## Build for Multiple Platforms

### Windows Installer (Setup.exe)
```bash
npm run build:win
```

### macOS
```bash
npm run build:mac
```

### Linux
```bash
npm run build:linux
```

## Database Considerations

### Included with Portable EXE

The portable EXE includes:
- Database schema files (`db/schema.sql`)
- Migration scripts
- Configuration files

### First Run Setup

Users will need to:
1. Have PostgreSQL installed
2. Configure database connection on first run
3. Or use embedded database (if configured)

### Alternative: Embedded Database

For truly portable experience, consider:
- Using SQLite instead of PostgreSQL
- Embedding the database files
- No external database required

## Version Management

Update version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

This version will appear in the EXE filename:
`Creative Hands POS-1.0.0-Portable.exe`

## Deployment Checklist

Before distributing:

- [ ] Test the portable EXE on a clean Windows machine
- [ ] Verify all features work correctly
- [ ] Check database connection setup
- [ ] Test with antivirus software enabled
- [ ] Verify file size is acceptable
- [ ] Create user documentation
- [ ] Include database setup instructions
- [ ] Test on different Windows versions (Windows 10, 11)

## Support

For build issues:
1. Check the [electron-builder documentation](https://www.electron.build/)
2. Review error messages carefully
3. Ensure all dependencies are correctly installed
4. Check Node.js and npm versions

## Notes

- **Build Time**: 5-10 minutes depending on your computer
- **Output Size**: ~200-400 MB
- **Platform**: Windows x64 only
- **Requirements**: Windows 7 or higher
- **No Installation**: Users can run directly

---

**Created for Creative Hands POS**  
**By TEVTA - Technical Education & Vocational Training Authority**
