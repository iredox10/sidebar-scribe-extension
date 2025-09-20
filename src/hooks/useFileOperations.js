import { syncToGoogleDrive, syncToGitHub, prepareSyncData } from '../utils/cloudSync';

export const useFileOperations = (notes, folders, selectedNote, onCreateNote, defaultFolderId) => {
  const saveToLocalFile = () => {
    if (!selectedNote) return;
    
    const blob = new Blob([selectedNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedNote.name}.md`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
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
