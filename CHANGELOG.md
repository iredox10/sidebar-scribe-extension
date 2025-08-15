# Changelog

All notable changes to the Sidebar Note extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-15

### Added
- Initial release of Sidebar Note Chrome extension
- Sidebar interface using Chrome's sidePanel API
- File and folder management system
- Local storage using Chrome's storage API
- Markdown editor with live preview
- Cloud sync placeholders for Google Drive and GitHub
- Complete documentation set
- Build and packaging scripts
- Validation and verification tools

### Features
- Create, organize, and delete notes and folders
- Root-level note creation (notes not associated with folders)
- Intuitive file explorer interface
- Automatic saving of all changes
- Toggle between Markdown edit and preview modes
- Sync buttons for Google Drive and GitHub (implementation ready)
- Responsive design for the browser side panel
- Comprehensive error handling

### Technical Implementation
- React-based frontend with modern hooks
- Component-based architecture
- Utility functions for business logic separation
- Background script for extension activation
- Vite build system configuration
- Manifest v3 compliance
- OAuth2 setup for cloud services

### Documentation
- User guide with usage instructions
- Developer documentation for extension maintenance
- Build and installation guide
- Cloud sync implementation guides
- Troubleshooting documentation
- Technical architecture overview
- Complete file structure documentation
- Utility script documentation

### Scripts
- Development environment setup script
- Build and packaging automation
- Manifest validation tool
- Project cleanup utility
- Quick verification script
- Comprehensive verification checklist

### Known Limitations
- Folder and note renaming requires deletion and recreation
- Moving notes between folders requires manual copying
- Cloud sync requires developer implementation
- No search functionality
- No tagging system
- No dark mode support

### Planned Enhancements
- Rich text editing capabilities
- Search functionality across notes
- Tagging system for organization
- Dark mode support
- Note history and versioning
- Import/export functionality
- Keyboard shortcuts
- Note templates
- Collaboration features

## Future Release Categories

### [1.1.0] - Minor Feature Enhancements
- Planned improvements to core functionality
- UI/UX enhancements
- Performance optimizations

### [1.2.0] - Advanced Features
- Rich text editing
- Search functionality
- Tagging system

### [2.0.0] - Major Enhancements
- Collaboration features
- Plugin system
- Mobile companion app integration

---

This changelog documents the evolution of the Sidebar Note extension from its initial release. Each entry includes the version number, release date, and a comprehensive list of changes made in that version.