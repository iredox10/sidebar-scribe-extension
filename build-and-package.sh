#!/bin/bash

# build-and-package.sh
# Script to build and package the Sidebar Note extension

echo "Building Sidebar Note Chrome Extension..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the extension
echo "Building the extension..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  # Create a zip file for distribution
  echo "Creating distribution package..."
  cd dist
  zip -r ../sidebar-note-extension.zip ./*
  cd ..
  
  echo "Extension packaged successfully!"
  echo "Distribution file: sidebar-note-extension.zip"
  echo ""
  echo "To install in Chrome:"
  echo "1. Open chrome://extensions"
  echo "2. Enable 'Developer mode'"
  echo "3. Click 'Load unpacked'"
  echo "4. Select the 'dist' folder"
  echo ""
  echo "Or install the packaged version:"
  echo "1. Open chrome://extensions"
  echo "2. Enable 'Developer mode'"
  echo "3. Drag and drop 'sidebar-note-extension.zip' onto the page"
else
  echo "Build failed. Check the output above for errors."
  exit 1
fi