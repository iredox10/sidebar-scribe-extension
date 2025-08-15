# Sidebar Note - Technical Documentation

## Overview

Sidebar Note is a Chrome extension that provides a note-taking application in the browser's sidebar panel. It features local storage, folder organization, Markdown editing, and cloud sync capabilities.

## Key Features Implemented

1. **Sidebar Interface** - Uses Chrome's `sidePanel` API
2. **File Management** - Create, organize, and delete notes and folders
3. **Local Storage** - Uses `chrome.storage.local` for data persistence
4. **Markdown Editor** - Edit and preview Markdown content
5. **Cloud Sync** - Placeholder functions for Google Drive and GitHub integration

## Architecture

```
src/
├── components/          # Reusable React components
│   └── MarkdownPreview.jsx
├── utils/               # Utility functions
│   ├── constants.js     # Application constants
│   ├── storage.js       # Chrome storage operations
│   ├── noteOperations.js # Note and folder operations
│   └── cloudSync.js     # Cloud synchronization (placeholders)
├── background/          # Chrome extension background scripts
│   └── background.js
├── App.jsx              # Main application component
├── App.css              # Application styles
└── main.jsx             # React entry point
```

## Core Components

### App.jsx

The main application component that manages:
- State for notes, folders, and UI
- Data loading and saving
- User interactions
- Cloud sync operations

### MarkdownPreview.jsx

A component that renders Markdown content as HTML.

### Storage Utilities

Helper functions in `src/utils/storage.js`:
- `saveNotes`, `loadNotes`
- `saveFolders`, `loadFolders`
- `saveAllData`, `loadAllData`

### Note Operations

Helper functions in `src/utils/noteOperations.js`:
- `createFolder`, `createNote`
- `deleteFolder`, `deleteNote`
- `updateNoteContent`
- `getNotesByFolder`, `getRootNotes`

## Data Structure

### Folder
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Folder name
  createdAt: string     // ISO date string
}
```

### Note
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Note title
  content: string,      // Markdown content
  folderId: string|null,// Parent folder ID or null for root
  createdAt: string,    // ISO date string
  updatedAt: string     // ISO date string
}
```

## Chrome APIs Used

1. **`chrome.sidePanel`** - Opens the sidebar panel
2. **`chrome.storage.local`** - Persists notes and folders
3. **`chrome.action`** - Handles extension icon clicks
4. **`chrome.identity`** - (Planned) OAuth authentication

## Styling

The application uses CSS modules with a clean, modern design:
- Responsive layout
- Intuitive file explorer
- Clear editor/preview separation
- Visual feedback for interactions

## Build Process

1. Vite compiles React components
2. Assets are bundled and optimized
3. Manifest.json is copied to dist folder
4. Background scripts are processed separately

## Extension Manifest

Key manifest features:
- `side_panel` declaration
- Required permissions (`storage`, `sidePanel`, `identity`)
- OAuth2 configuration for Google Drive
- Host permissions for cloud APIs

## Future Enhancements

1. **Rich Text Editing** - Beyond Markdown
2. **Search Functionality** - Find notes by content
3. **Tags System** - Alternative organization method
4. **Export/Import** - Backup and restore options
5. **Dark Mode** - User preference support
6. **Keyboard Shortcuts** - Improved accessibility
7. **Note Templates** - Quick start options
8. **Collaboration** - Shared notes/folders

## Testing

The application includes:
- Manual UI testing
- Data persistence verification
- Error handling validation
- Cross-browser compatibility checks

## Deployment

1. Build with `npm run build`
2. Load unpacked extension in Chrome
3. Test all functionality
4. Package for Chrome Web Store