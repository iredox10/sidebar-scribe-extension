# Sidebar Note - Build and Installation Guide

## Prerequisites

Before building the extension, ensure you have:

1. **Node.js** (version 14 or higher)
2. **npm** (comes with Node.js)
3. **Google Chrome** browser

## Building the Extension

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies listed in package.json.

### Step 2: Build the Extension

Run the build command:

```bash
npm run build
```

This will:
- Compile the React application
- Bundle all assets
- Generate a `dist` folder with the production-ready extension

### Build Output

After a successful build, you'll have a `dist` folder containing:
- `index.html` - Main HTML file
- `manifest.json` - Updated extension manifest
- `assets/` - Compiled JavaScript, CSS, and other assets
- `vite.svg` - Extension icon

## Installing the Extension

### Method 1: Developer Mode (Recommended for Testing)

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in the top right corner)
3. Click "Load unpacked"
4. Select the `dist` folder from this project
5. The extension should now appear in your extensions list

### Method 2: Packaging for Distribution

To create a packaged version:

1. Select all files in the `dist` folder
2. Create a zip archive
3. The resulting `.zip` file can be uploaded to the Chrome Web Store

## Testing the Extension

After installation:

1. Click the extension icon in the Chrome toolbar
2. The sidebar should open on the right side of your browser
3. Test creating folders and notes
4. Verify that notes are saved automatically
5. Try the Markdown preview functionality
6. Test the cloud sync buttons (will show placeholders)

## Development Workflow

### Development Server

For active development with hot reloading:

```bash
npm run dev
```

This starts a local development server, but note that you'll need to build the extension to test it as an actual Chrome extension.

### Making Changes

1. Edit files in the `src` directory
2. Run `npm run build` to compile changes
3. Reload the extension in `chrome://extensions` (click the refresh icon)
4. Test your changes

## Customization

### Extension Information

To customize the extension name, description, or version:
1. Edit `manifest.json`
2. Update the relevant fields
3. Rebuild the extension

### Styling

To modify the appearance:
1. Edit `src/App.css` for component styles
2. Edit `src/index.css` for global styles
3. Rebuild the extension

### Functionality

To add new features:
1. Modify `src/App.jsx` for UI changes
2. Add new utility functions in `src/utils/`
3. Rebuild the extension

## Troubleshooting Installation Issues

### "Failed to load extension" Error

If you see this error:
1. Verify all files are in the `dist` folder
2. Check that `manifest.json` is valid JSON
3. Ensure the `side_panel` path in manifest.json is correct
4. Verify the background script path in manifest.json

### Extension Not Appearing

If the extension doesn't appear after loading:
1. Check that Developer Mode is enabled
2. Verify you selected the correct `dist` folder
3. Check the extension's error log in chrome://extensions

### Functionality Issues

If features aren't working:
1. Check the Chrome Developer Console for errors
2. Verify all required permissions are in manifest.json
3. Ensure Chrome is up to date

## Publishing to Chrome Web Store

To publish the extension:

1. Create a developer account at https://chrome.google.com/webstore/developer/dashboard
2. Pay the one-time developer registration fee
3. Create a zip file of the contents of the `dist` folder
4. Upload the zip file to the developer dashboard
5. Fill in the required information (description, screenshots, etc.)
6. Submit for review

## Updating the Extension

To release an update:

1. Make your changes to the source code
2. Update the version number in `manifest.json`
3. Run `npm run build` to create a new build
4. Create a new zip file of the `dist` folder
5. Upload the new version to the Chrome Web Store

## Support

For issues with building or installing the extension, refer to:
- README.md for general information
- TROUBLESHOOTING.md for common issues
- The project's issue tracker for bug reports

The extension is now ready to use for local note-taking with the option to extend for cloud synchronization.