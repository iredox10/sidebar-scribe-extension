# Sidebar Note

A Chrome extension for taking notes in a sidebar panel with Markdown support.

## Features

- Sidebar interface using Chrome's sidePanel API
- File and folder management for organizing notes
- Markdown editor with live preview
- Local storage using Chrome's storage API
- Cloud syncing placeholders for Google Drive and GitHub

## Quick Start

1. Clone this repository
2. Run the setup script: `./dev-setup.sh`
3. Build the extension: `./build-and-package.sh`
4. Open Chrome and navigate to `chrome://extensions`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` directory

## Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Chrome and navigate to `chrome://extensions`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` directory

## Development

- Run `npm run dev` to start the development server
- Run `npm run build` to create a production build

## Cloud Sync Setup

### Google Drive

1. Create a Google Cloud Project
2. Enable the Google Drive API
3. Create OAuth2 credentials
4. Replace `YOUR_GOOGLE_CLIENT_ID` in `manifest.json` with your actual client ID

### GitHub

1. Register a GitHub OAuth application
2. Configure the authorization callback URL
3. Use the provided client ID and secret in the sync implementation

## Folder Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Entry point
├── background/
│   └── background.js # Background script for side panel activation
```

## Usage

1. Click the extension icon to open the sidebar
2. Create folders and notes using the sidebar interface
3. Select a note to edit it in Markdown
4. Toggle between edit and preview modes
5. Use the sync buttons to sync with cloud services (implementation required)

## Scripts

- `./dev-setup.sh` - Sets up the development environment
- `./build-and-package.sh` - Builds and packages the extension for distribution