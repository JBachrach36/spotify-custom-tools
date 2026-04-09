@echo off
echo Starting PlaylistVibe...

:: Check if node_modules exists, install dependencies if missing
if not exist node_modules\ (
    echo Installing dependencies...
    call npm install
)

:: Start the Next.js development server in the background
echo Starting the development server...
start /b cmd /c "npm run dev"

:: Wait a few seconds to let the server initialize
timeout /t 5 /nobreak > NUL

:: Open the browser to 127.0.0.1
echo Opening browser to http://127.0.0.1:3000...
start http://127.0.0.1:3000

echo Ready! You can close this window when you're done stopping the server.
