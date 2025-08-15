#!/bin/bash

# clean-project.sh
# Script to clean the project directory

echo "Cleaning Sidebar Note project..."

# Confirm with user before cleaning
read -p "This will remove the dist folder and node_modules. Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Clean cancelled."
    exit 0
fi

# Remove dist folder
if [ -d "dist" ]; then
    echo "Removing dist folder..."
    rm -rf dist
    echo "dist folder removed."
else
    echo "dist folder not found."
fi

# Remove node_modules
if [ -d "node_modules" ]; then
    echo "Removing node_modules folder..."
    rm -rf node_modules
    echo "node_modules folder removed."
else
    echo "node_modules folder not found."
fi

# Remove package-lock.json
if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json..."
    rm package-lock.json
    echo "package-lock.json removed."
else
    echo "package-lock.json not found."
fi

# Remove build artifacts
echo "Removing build artifacts..."
rm -f *.zip
echo "Build artifacts removed."

echo "Project cleaned successfully!"
echo ""
echo "To set up again:"
echo "1. Run ./dev-setup.sh"
echo "2. Or run npm install"