# Quick Start Guide

Get up and running with Sidebar Note in under 5 minutes!

## Prerequisites

- Google Chrome browser
- Node.js (version 14 or higher) - for building
- npm (comes with Node.js)

## Quick Installation

1. **Download the code**:
   Clone or download this repository to your computer

2. **Install dependencies**:
   ```bash
   cd side-note
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder in this project

5. **Start using**:
   - Click the new extension icon in your toolbar
   - The sidebar note app will open in the side panel

## First Steps

1. **Create a folder**:
   - Type a name in the "New folder name" field
   - Click "Create Folder"

2. **Create a note**:
   - Type a name in the "New note name" field
   - Click "Create Note"
   - Or create a note inside a folder using the "+ New Note" button

3. **Edit a note**:
   - Click on any note to select it
   - Type in the editor pane
   - Try some Markdown:
     ```
     # My Title
     **Bold text** and *italic text*
     - List item 1
     - List item 2
     ```

4. **Preview Markdown**:
   - Click the "Preview" button to see rendered Markdown
   - Click "Edit" to return to editing mode

5. **Organize with folders**:
   - Create folders for different topics
   - Move notes between folders (drag and drop coming soon)

6. **Try cloud sync**:
   - Click "Sync to Drive" or "Sync to GitHub"
   - (Note: Full implementation requires additional setup - see SETUP_GUIDE.md)

## Key Features

- **Persistent storage**: Notes are saved automatically
- **Folder organization**: Keep notes organized
- **Markdown support**: Rich text formatting
- **Preview mode**: See how your notes will look
- **Cloud sync ready**: Prepared for Google Drive and GitHub integration

## Need Help?

- **Full setup guide**: See SETUP_GUIDE.md
- **Troubleshooting**: See TROUBLESHOOTING.md
- **Technical details**: See TECHNICAL_DOCUMENTATION.md

## Next Steps

1. **Customize the UI**: Edit src/App.css
2. **Add features**: Modify src/App.jsx
3. **Implement cloud sync**: Follow CLOUD_SYNC_IMPLEMENTATION.md
4. **Package for distribution**: Create a zip of the dist folder

## Feedback

Found a bug or have a feature request? Check the issues tab on GitHub or create a new one!

Happy note-taking!