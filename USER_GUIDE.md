# Sidebar Note - User Guide

## Getting Started

1. Install the extension in Chrome
2. Click the extension icon in the toolbar
3. The sidebar will open on the right side of your browser

## Creating Notes

### Root-Level Notes (Not in Folders)
1. Find the "New note name" input at the top of the sidebar
2. Type a name for your note
3. Click the "Create Note" button
4. Your note will appear under the "Root" section

### Folder Notes
1. First, create a folder (see below)
2. Click the "+ New Note" button inside the folder
3. Enter a name for your note in the popup
4. Click OK
5. Your note will appear inside the folder

## Creating Folders

1. Find the "New folder name" input at the top of the sidebar
2. Type a name for your folder
3. Click the "Create Folder" button
4. Your new folder will appear in the file explorer

## Editing Notes

1. Click on any note in the file explorer
2. The note content will appear in the editor pane
3. Start typing to edit your note
4. Notes are automatically saved as you type

## Markdown Support

The editor supports Markdown formatting:

- **Bold**: `**text**`
- *Italic*: `*text*`
- `Code`: `` `code` ``
- # Header 1: `# text`
- ## Header 2: `## text`
- ### Header 3: `### text`
- List item: `- item`

To preview your Markdown:
1. Click the "Preview" button at the top of the editor
2. Your formatted note will appear
3. Click "Edit" to return to editing mode

## Organizing Your Notes

### Renaming Folders or Notes
- Currently requires deleting and recreating (planned feature)

### Moving Notes Between Folders
- Currently requires copying content and creating new note (planned feature)

### Deleting Folders or Notes
1. Find the folder or note you want to delete
2. Click the × button next to its name
3. Confirm the deletion

Note: Deleting a folder will also delete all notes inside it.

## Cloud Sync

The extension includes buttons for syncing with cloud services:

### Google Drive Sync
1. Click the "Sync to Drive" button
2. (First time only) Complete the authentication flow
3. Your notes will be backed up to Google Drive

### GitHub Sync
1. Click the "Sync to GitHub" button
2. (First time only) Complete the authentication flow
3. Your notes will be backed up to GitHub

Note: Full cloud sync requires additional setup by the developer (see CLOUD_SYNC_IMPLEMENTATION.md).

## Tips & Tricks

1. **Quick Access**: Pin the sidebar open by clicking the extension icon again while it's open
2. **Large Notes**: The editor supports notes of any length
3. **Organization**: Use folders to organize notes by topic, project, or any system that works for you
4. **Root Notes**: Perfect for quick notes that don't need folder organization
5. **Markdown Preview**: Check how your notes will look before sharing

## Troubleshooting

### Notes Not Saving
- Check that you're connected to the internet
- Try refreshing the browser
- Restart the extension

### Sidebar Not Opening
- Click the extension icon again
- Check that the extension is enabled in chrome://extensions
- Restart Chrome

### Sync Not Working
- Cloud sync requires developer setup
- See CLOUD_SYNC_IMPLEMENTATION.md for implementation details

## Feedback

If you encounter any issues or have suggestions for improvement, please check the project's issue tracker or contact the developer.

Happy note-taking!