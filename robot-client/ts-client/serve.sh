#!/bin/bash

echo "Starting TypeScript client for Robot Tracking System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH."
    echo "Please install npm (it usually comes with Node.js)"
    exit 1
fi

# Change to the script's directory
cd "$(dirname "$0")"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies."
        exit 1
    fi
fi

# Start the development server
echo "Starting development server..."
echo "The client will be available at http://localhost:8080"
echo "Press Ctrl+C to stop the server"
npm start