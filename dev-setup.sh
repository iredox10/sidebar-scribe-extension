#!/bin/bash

# dev-setup.sh
# Script to set up the development environment for Sidebar Note

echo "Setting up Sidebar Note development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js (version 14 or higher) and try again."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Check if node_modules exists
if [ -d "node_modules" ]; then
  echo "node_modules directory already exists."
  echo "Skipping dependency installation."
else
  echo "Installing dependencies..."
  npm install
  
  if [ $? -eq 0 ]; then
    echo "Dependencies installed successfully!"
  else
    echo "Failed to install dependencies. Check the output above for errors."
    exit 1
  fi
fi

# Check if dist directory exists and offer to clean it
if [ -d "dist" ]; then
  echo ""
  echo "dist directory already exists."
  read -p "Do you want to clean it? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    rm -rf dist
    echo "dist directory cleaned."
  fi
fi

echo ""
echo "Development environment setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "To build and package for distribution:"
echo "  ./build-and-package.sh"