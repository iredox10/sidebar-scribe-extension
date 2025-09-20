#!/bin/bash

echo "🔨 Building Chrome Extension..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📝 To test your extension:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode'"
    echo "3. Click 'Load unpacked'"
    echo "4. Select this folder: $(pwd)/dist"
    echo ""
    echo "🔄 After making changes, run this script again and refresh the extension in Chrome"
else
    echo "❌ Build failed!"
    exit 1
fi
