#!/bin/bash

# quick-verify.sh
# Script to quickly verify the project setup

echo "Quick Verification of Sidebar Note Project"
echo "========================================="

# Check if required files exist
echo "Checking required files..."
required_files=(
    "manifest.json"
    "package.json"
    "index.html"
    "src/App.jsx"
    "src/App.css"
    "src/main.jsx"
    "src/background/background.js"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "/home/iredox/Desktop/chromeExtensions/side-note/$file" ]; then
        echo "✓ $file found"
    else
        echo "✗ $file missing"
        missing_files=1
    fi
done

# Check if required directories exist
echo ""
echo "Checking required directories..."
required_dirs=(
    "src"
    "src/components"
    "src/utils"
    "src/background"
)

missing_dirs=0
for dir in "${required_dirs[@]}"; do
    if [ -d "/home/iredox/Desktop/chromeExtensions/side-note/$dir" ]; then
        echo "✓ $dir directory found"
    else
        echo "✗ $dir directory missing"
        missing_dirs=1
    fi
done

# Check manifest permissions
echo ""
echo "Checking manifest permissions..."
if grep -q '"sidePanel"' /home/iredox/Desktop/chromeExtensions/side-note/manifest.json; then
    echo "✓ sidePanel permission found"
else
    echo "✗ sidePanel permission missing"
fi

if grep -q '"storage"' /home/iredox/Desktop/chromeExtensions/side-note/manifest.json; then
    echo "✓ storage permission found"
else
    echo "✗ storage permission missing"
fi

if grep -q '"identity"' /home/iredox/Desktop/chromeExtensions/side-note/manifest.json; then
    echo "✓ identity permission found"
else
    echo "✗ identity permission missing"
fi

# Check for key components
echo ""
echo "Checking key components..."
if grep -q "chrome.storage.local" /home/iredox/Desktop/chromeExtensions/side-note/src/App.jsx; then
    echo "✓ Chrome storage integration found"
else
    echo "✗ Chrome storage integration missing"
fi

if grep -q "sidePanel.open" /home/iredox/Desktop/chromeExtensions/side-note/src/background/background.js; then
    echo "✓ Side panel activation found"
else
    echo "✗ Side panel activation missing"
fi

# Check for markdown support
if grep -q "MarkdownPreview" /home/iredox/Desktop/chromeExtensions/side-note/src/App.jsx; then
    echo "✓ Markdown preview component found"
else
    echo "✗ Markdown preview component missing"
fi

# Check for cloud sync placeholders
if grep -q "syncToGoogleDrive" /home/iredox/Desktop/chromeExtensions/side-note/src/App.jsx; then
    echo "✓ Google Drive sync placeholder found"
else
    echo "✗ Google Drive sync placeholder missing"
fi

if grep -q "syncToGitHub" /home/iredox/Desktop/chromeExtensions/side-note/src/App.jsx; then
    echo "✓ GitHub sync placeholder found"
else
    echo "✗ GitHub sync placeholder missing"
fi

# Summary
echo ""
echo "Summary"
echo "======="
if [ $missing_files -eq 0 ] && [ $missing_dirs -eq 0 ]; then
    echo "✓ All required files and directories present"
else
    echo "✗ Some required files or directories are missing"
fi

echo ""
echo "Verification complete!"
echo "For a detailed verification, refer to VERIFICATION_CHECKLIST.md"