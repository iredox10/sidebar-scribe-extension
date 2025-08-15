# Project Structure

```
side-note/
├── dist/                    # Built extension files (generated)
├── node_modules/           # NPM dependencies
├── public/                 # Static assets
│   └── vite.svg           # Default Vite icon
├── src/                    # Source code
│   ├── assets/            # React assets
│   │   └── react.svg      # React logo
│   ├── background/        # Chrome extension background scripts
│   │   └── background.js  # Handles side panel activation
│   ├── utils/             # Utility functions
│   │   ├── constants.js   # Application constants
│   │   └── storage.js     # Storage helper functions
│   ├── App.css            # Main application styles
│   ├── App.jsx            # Main React component
│   ├── index.css          # Global styles
│   ├── main.jsx           # React entry point
│   └── service-worker.js  # Chrome extension service worker
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── manifest.json          # Chrome extension manifest
├── package-lock.json      # NPM lock file
├── package.json           # NPM package configuration
├── README.md              # Project documentation
└── vite.config.js         # Vite build configuration
```

## Key Files

### manifest.json
Defines the Chrome extension properties, permissions, and entry points.

### src/App.jsx
Main React component implementing the note-taking functionality:
- File explorer with folder/note management
- Markdown editor with preview
- Local storage integration
- Cloud sync placeholders

### src/background/background.js
Background script that opens the side panel when the extension icon is clicked.

### src/utils/storage.js
Helper functions for interacting with Chrome's storage API.

### src/utils/constants.js
Application constants and default values.