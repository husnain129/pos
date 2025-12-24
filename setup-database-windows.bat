@echo off
echo ========================================
echo Creative Hands POS - Database Setup
echo ========================================
echo.

set /p DB_HOST="Enter PostgreSQL Host (default: localhost): " || set DB_HOST=localhost
set /p DB_PORT="Enter PostgreSQL Port (default: 5432): " || set DB_PORT=5432
set /p DB_NAME="Enter Database Name (default: pos): " || set DB_NAME=pos
set /p DB_USER="Enter Database Username (default: postgres): " || set DB_USER=postgres
set /p DB_PASS="Enter Database Password: "

echo.
echo Creating database configuration...

set CONFIG_DIR=%APPDATA%\Creative Hands POS
if not exist "%CONFIG_DIR%" mkdir "%CONFIG_DIR%"

(
echo {
echo   "host": "%DB_HOST%",
echo   "port": %DB_PORT%,
echo   "database": "%DB_NAME%",
echo   "user": "%DB_USER%",
echo   "password": "%DB_PASS%"
echo }
) > "%CONFIG_DIR%\database.json"

echo.
echo ========================================
echo Configuration saved to:
echo %CONFIG_DIR%\database.json
echo ========================================
echo.
echo Now creating database schema...
echo.

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f db\schema.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database setup complete.
    echo ========================================
    echo.
    echo Default Login:
    echo   Username: admin
    echo   Password: admin
    echo.
    echo Press any key to exit...
    pause >nul
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to setup database.
    echo ========================================
    echo.
    echo Please check:
    echo 1. PostgreSQL is installed and running
    echo 2. Database '%DB_NAME%' exists
    echo 3. Username and password are correct
    echo.
    echo Press any key to exit...
    pause >nul
)
