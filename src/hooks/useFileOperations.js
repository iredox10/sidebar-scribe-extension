import { syncToGoogleDrive, syncToGitHub, prepareSyncData } from '../utils/cloudSync';

export const useFileOperations = (notes, folders, selectedNote, onCreateNote, defaultFolderId) => {
  const saveToLocalFile = async () => {
    if (!selectedNote) return;
    
    // Get the default file format from settings
    let fileFormat = 'md';
    try {
      const result = await chrome.storage.local.get(['defaultFileFormat']);
      fileFormat = result.defaultFileFormat || 'md';
    } catch (error) {
      console.error('Error loading file format setting:', error);
    }
    
    // Prepare content based on format
    let content = selectedNote.content;
    let mimeType = 'text/markdown';
    
    if (fileFormat === 'html') {
      // Convert markdown to HTML (basic conversion)
      // You could enhance this with a proper markdown parser if needed
      content = convertMarkdownToHTML(selectedNote.content);
      mimeType = 'text/html';
    } else if (fileFormat === 'txt') {
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedNote.name}.${fileFormat}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // Helper function to convert markdown to HTML
  const convertMarkdownToHTML = (markdown) => {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    // Wrap in basic HTML structure
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${selectedNote?.name || 'Note'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1, h2, h3 { color: #333; }
        a { color: #0066cc; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
  };

  const loadFromLocalFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const content = await file.text();
        const noteName = file.name.replace(/\.[^/.]+$/, "");
        
        const newNote = onCreateNote(noteName, defaultFolderId);
        if (newNote) {
          // We'll need to update the content through the parent component
          // This is a limitation of the current hook structure
          console.log('File loaded, note created:', newNote);
          return { note: newNote, content };
        }
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };
    
    input.click();
  };

  const syncToGoogleDriveHandler = async () => {
    const syncData = prepareSyncData(notes, folders);
    const result = await syncToGoogleDrive(syncData);
    
    console.log('Google Drive sync result:', result);
  };

  const syncToGitHubHandler = async () => {
    const syncData = prepareSyncData(notes, folders);
    const result = await syncToGitHub(syncData);
    
    console.log('GitHub sync result:', result);
  };

  return {
    saveToLocalFile,
    loadFromLocalFile,
    syncToGoogleDrive: syncToGoogleDriveHandler,
    syncToGitHub: syncToGitHubHandler
  };
};
