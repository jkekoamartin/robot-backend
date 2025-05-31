#!/bin/bash

echo "Starting web server for Robot Tracking System Client..."
echo "Open your browser and navigate to http://localhost:8000"
echo "Press Ctrl+C to stop the server"

# Change to the client directory
cd "$(dirname "$0")"

# Check if Python 3 is available
if command -v python3 &>/dev/null; then
    python3 -m http.server
# Check if Python 2 is available
elif command -v python &>/dev/null; then
    python -m SimpleHTTPServer
# If neither Python version is available, suggest alternatives
else
    echo "Error: Python is not installed or not in PATH."
    echo "Please install Python or use an alternative web server:"
    echo "  - Node.js: npm install -g http-server && http-server"
    echo "  - PHP: php -S localhost:8000"
    exit 1
fi