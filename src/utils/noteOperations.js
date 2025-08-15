// src/utils/noteOperations.js

export const createFolder = (folders, folderName) => {
  if (!folderName.trim()) return folders;
  
  const newFolder = {
    id: Date.now().toString(),
    name: folderName.trim(),
    createdAt: new Date().toISOString()
  };
  
  return [...folders, newFolder];
};

export const createNote = (notes, noteName, folderId = null) => {
  if (!noteName.trim()) return notes;
  
  const newNote = {
    id: Date.now().toString(),
    name: noteName.trim(),
    content: '',
    folderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return [...notes, newNote];
};

export const deleteFolder = (folders, notes, folderId) => {
  // Delete the folder
  const updatedFolders = folders.filter(folder => folder.id !== folderId);
  
  // Delete all notes in the folder
  const updatedNotes = notes.filter(note => note.folderId !== folderId);
  
  return {
    folders: updatedFolders,
    notes: updatedNotes
  };
};

export const deleteNote = (notes, noteId) => {
  return notes.filter(note => note.id !== noteId);
};

export const updateNoteContent = (notes, noteId, content) => {
  return notes.map(note => {
    if (note.id === noteId) {
      return {
        ...note,
        content,
        updatedAt: new Date().toISOString()
      };
    }
    return note;
  });
};

export const getNotesByFolder = (notes, folderId) => {
  return notes.filter(note => note.folderId === folderId);
};

export const getRootNotes = (notes) => {
  return notes.filter(note => !note.folderId);
};

export const findNoteById = (notes, noteId) => {
  return notes.find(note => note.id === noteId) || null;
};