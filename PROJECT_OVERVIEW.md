# Sidebar Note - Project Overview

## Project Structure

```
side-note/
├── src/
│   ├── components/
│   │   └── MarkdownPreview.jsx    # Markdown rendering component
│   ├── utils/
│   │   ├── constants.js           # Application constants
│   │   ├── storage.js             # Chrome storage operations
│   │   ├── noteOperations.js      # Note/folder manipulation functions
│   │   └── cloudSync.js           # Cloud sync placeholders
│   ├── background/
│   │   └── background.js          # Extension activation handler
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Application styling
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── public/
│   └── vite.svg                   # Extension icon
├── manifest.json                  # Chrome extension manifest
├── index.html                     # Main HTML entry point
├── vite.config.js                 # Build configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # Project documentation
```

## Key Features Implemented

### 1. Sidebar Interface
- Uses Chrome's `sidePanel` API
- Opens when clicking the extension icon
- Responsive design for the browser side panel

### 2. File & Folder Management
- Create, rename, and delete notes and folders
- Organize notes within folders
- Root-level note creation (notes not associated with folders)
- Intuitive file explorer interface

### 3. Local First Storage
- All notes and folder structures stored locally using `chrome.storage.local`
- Automatic saving of all changes
- Data persistence across browser sessions

### 4. Markdown Editor
- Text area for writing notes in Markdown
- Live preview pane that renders Markdown as HTML
- Toggle between edit and preview modes

### 5. Cloud Syncing (Setup Only)
- UI buttons for Google Drive and GitHub sync
- Manifest configured with necessary permissions
- OAuth2 setup for Google Drive authentication
- Placeholder functions with implementation guides

## Core Implementation Details

### App.jsx
The main application component that manages:
- State for notes, folders, and UI elements
- Data loading and saving with chrome.storage.local
- User interactions for creating/deleting notes and folders
- Cloud sync operations
- Integration with utility functions

### Key Functionality
- **Root Notes**: Users can create notes without associating them with folders
- **Folder Organization**: Notes can be organized within folders
- **Markdown Support**: Edit and preview Markdown content
- **Local Storage**: All data persists between browser sessions
- **Cloud Sync Ready**: Prepared placeholders for Google Drive and GitHub integration

### Data Structure
```javascript
// Folder
{
  id: string,
  name: string,
  createdAt: string
}

// Note
{
  id: string,
  name: string,
  content: string,
  folderId: string|null,  // null for root-level notes
  createdAt: string,
  updatedAt: string
}
```

## How to Use

1. **Create Root-Level Notes**: Use the "New note name" field at the top to create notes not associated with any folder
2. **Create Folders**: Use the "New folder name" field to organize your notes
3. **Create Folder Notes**: Within each folder, use the "+ New Note" button to create notes inside that folder
4. **Edit Notes**: Click on any note to select it, then type in the editor pane
5. **Preview Markdown**: Click the "Preview" button to see how your Markdown will render
6. **Cloud Sync**: Use the "Sync to Drive" or "Sync to GitHub" buttons (requires additional setup)

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- Includes additional utility scripts for validation and packaging

## Next Steps

To implement full cloud sync functionality:
1. Follow the guides in CLOUD_SYNC_IMPLEMENTATION.md
2. Register OAuth applications with Google and GitHub
3. Update manifest.json with your OAuth credentials
4. Implement the authentication flows in the sync functions

The extension is ready for use as-is for local note-taking with the option to extend for cloud synchronization.