# Setup Guide

## Prerequisites

1. Node.js (version 14 or higher)
2. npm (comes with Node.js)
3. Google Chrome browser

## Installation

1. Clone or download this repository
2. Open a terminal in the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To run the development server:
```bash
npm run dev
```

This will start a local development server with hot reloading.

## Building the Extension

To create a production build:
```bash
npm run build
```

This will:
1. Compile the React application
2. Bundle all assets
3. Copy the manifest.json file to the dist folder

The built extension will be in the `dist` directory.

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `dist` directory from this project
5. The extension should now appear in your extensions list

## Setting up Cloud Sync

### Google Drive Sync

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the application type to "Chrome App"
6. Copy the Client ID
7. Replace `YOUR_GOOGLE_CLIENT_ID` in `manifest.json` with your actual Client ID

### GitHub Sync

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" and then "New OAuth App"
3. Fill in the application details:
   - Application name: Sidebar Note
   - Homepage URL: (your extension's URL)
   - Authorization callback URL: (depends on your implementation)
4. Register the application
5. Copy the Client ID and Client Secret
6. Implement the authentication flow in the sync functions

## Folder Structure After Build

After running `npm run build`, your `dist` folder will contain:
- `index.html` - Main HTML file
- `manifest.json` - Extension manifest
- `assets/` - Compiled JavaScript, CSS, and other assets
- `public/` - Static assets like icons

## Troubleshooting

### Extension not loading
- Ensure all files are in the `dist` folder
- Check that `manifest.json` is valid JSON
- Verify that the extension has all required permissions

### Storage not working
- Make sure the `storage` permission is in `manifest.json`
- Check the Chrome Developer Console for errors

### Sync not working
- Verify OAuth credentials are correctly set
- Check network requests in Developer Tools
- Ensure proper scopes are requested

## Customization

### Changing the extension name or description
Edit the `manifest.json` file:
- `name`: Extension name
- `description`: Extension description
- `version`: Extension version

### Modifying the UI
Edit the files in `src/`:
- `App.jsx`: Main application component
- `App.css`: Application styles
- `index.css`: Global styles

### Adding new features
1. Create new components in `src/components/`
2. Add new utility functions in `src/utils/`
3. Update `manifest.json` if new permissions are needed