// src/utils/storage.js

export const saveNotes = async (notes) => {
  try {
    await chrome.storage.local.set({ notes });
    return { success: true };
  } catch (error) {
    console.error('Error saving notes:', error);
    return { success: false, error };
  }
};

export const loadNotes = async () => {
  try {
    const result = await chrome.storage.local.get(['notes']);
    return { success: true, data: result.notes || [] };
  } catch (error) {
    console.error('Error loading notes:', error);
    return { success: false, error };
  }
};

export const saveFolders = async (folders) => {
  try {
    await chrome.storage.local.set({ folders });
    return { success: true };
  } catch (error) {
    console.error('Error saving folders:', error);
    return { success: false, error };
  }
};

export const loadFolders = async () => {
  try {
    const result = await chrome.storage.local.get(['folders']);
    return { success: true, data: result.folders || [] };
  } catch (error) {
    console.error('Error loading folders:', error);
    return { success: false, error };
  }
};

export const saveAllData = async (notes, folders) => {
  try {
    await chrome.storage.local.set({ notes, folders });
    return { success: true };
  } catch (error) {
    console.error('Error saving all data:', error);
    return { success: false, error };
  }
};

export const loadAllData = async () => {
  try {
    const result = await chrome.storage.local.get(['notes', 'folders']);
    return { 
      success: true, 
      notes: result.notes || [], 
      folders: result.folders || [] 
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    return { success: false, error };
  }
};

// Save note to local file system
export const saveNoteToFile = async (note, filePath = null) => {
  try {
    // In a real Chrome extension, we would use the chrome.fileSystem API
    // For now, we'll create a download using the Downloads API
    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Use Chrome's downloads API to save the file
    const downloadId = await chrome.downloads.download({
      url: url,
      filename: `${note.name}.md`,
      saveAs: true // Prompt user for save location
    });
    
    // Clean up the object URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return { 
      success: true, 
      message: `Note "${note.name}" saved successfully`,
      downloadId: downloadId
    };
  } catch (error) {
    console.error('Error saving note to file:', error);
    return { success: false, error: error.message || 'Failed to save note to file' };
  }
};

// Load note from local file system
export const loadNoteFromFile = async () => {
  try {
    // In a real Chrome extension, we would use the chrome.fileSystem API
    // For now, we'll prompt the user to select a file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    
    return new Promise((resolve) => {
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
          resolve({ success: false, error: 'No file selected' });
          return;
        }
        
        try {
          const content = await file.text();
          const noteName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          
          const newNote = {
            id: Date.now().toString(),
            name: noteName,
            content: content,
            folderId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          resolve({ success: true, note: newNote });
        } catch (error) {
          console.error('Error reading file:', error);
          resolve({ success: false, error: error.message || 'Failed to read file' });
        }
      };
      
      input.click();
    });
  } catch (error) {
    console.error('Error loading note from file:', error);
    return { success: false, error: error.message || 'Failed to load note from file' };
  }
};