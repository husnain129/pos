# Quick Start - Build Portable EXE

This is a quick guide to build a single shareable portable EXE file for Creative Hands POS.

## 🚀 Quick Build (3 Steps)

### On Windows:

1. **Open Command Prompt** in the project folder
2. **Run the build script**:
   ```cmd
   build-portable.bat
   ```
3. **Wait 5-10 minutes** - Your EXE will be in the `dist` folder

### On macOS/Linux:

1. **Open Terminal** in the project folder
2. **Run the build script**:
   ```bash
   ./build-portable.sh
   ```
3. **Wait 5-10 minutes** - Your EXE will be in the `dist` folder

### Manual Build:

If scripts don't work, run:
```bash
npm install
npm run build:portable
```

## 📦 What You Get

After building, you'll find:
```
dist/
  └── Creative Hands POS-Portable.exe  (Single shareable file)
```

Size: ~200-400 MB

## ✅ Requirements

- Node.js (v14 or higher)
- Internet connection (first time only, to download dependencies)
- ~2 GB free disk space

## 📤 Sharing the EXE

1. Go to the `dist` folder
2. Copy `Creative Hands POS-Portable.exe`
3. Share this single file with users
4. Users just double-click to run (no installation needed)

## ⚙️ Build Options

### Default Build (Portable EXE):
```bash
npm run build:portable
```

### All Platforms:
```bash
npm run build           # Build for all platforms
npm run build:win       # Windows installer
npm run build:mac       # macOS
npm run build:linux     # Linux
```

## 🔧 Troubleshooting

### Build fails?
```bash
rm -rf node_modules
npm install
npm run build:portable
```

### Need more details?
See [BUILD_PORTABLE_EXE.md](BUILD_PORTABLE_EXE.md) for complete documentation.

## 📝 Notes

- **First build takes longer** (downloads Electron)
- **Subsequent builds are faster**
- **Output is a single portable EXE**
- **No installation required for end users**
- **Works on Windows 7, 8, 10, 11**

---

**For detailed documentation, see [BUILD_PORTABLE_EXE.md](BUILD_PORTABLE_EXE.md)**
