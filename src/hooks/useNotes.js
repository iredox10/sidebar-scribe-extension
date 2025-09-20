import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadAllData, saveAllData } from '../utils/storage';
import {
  createFolder,
  createNote,
  deleteFolder,
  deleteNote,
  updateNoteContent,
  getNotesByFolder,
  getRootNotes,
  findNoteById
} from '../utils/noteOperations';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // Load data from chrome.storage.local on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await loadAllData();
        if (result.success) {
          setNotes(result.notes || []);
          setFolders(result.folders || []);
          
          // Load favorites
          const favoritesResult = await chrome.storage.local.get(['favorites']);
          if (favoritesResult.favorites) {
            setFavorites(new Set(favoritesResult.favorites));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to chrome.storage.local whenever notes or folders change
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveAllData(notes, folders);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [notes, folders]);

  // Save favorites
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await chrome.storage.local.set({ favorites: Array.from(favorites) });
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };

    saveFavorites();
  }, [favorites]);

    const handleCreateFolder = (folderName) => {
    if (!folderName) folderName = `Folder - ${uuidv4().slice(0, 8)}`;
    
    const newFolder = {
      id: Date.now().toString(),
      name: folderName.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Add new folder at the beginning of the array
    setFolders([newFolder, ...folders]);
    return newFolder;
  };

    const handleCreateNote = (noteName, folderId = null, defaultFolderId = null) => {
    if (!noteName) noteName = `Note - ${uuidv4().slice(0, 8)}`;
    
    const targetFolderId = folderId || defaultFolderId || null;
    
    const newNote = {
      id: Date.now().toString(),
      name: noteName.trim(),
      content: '',
      folderId: targetFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add new note at the beginning of the array
    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote;
  };

  const handleDeleteFolder = (folderId) => {
    const result = deleteFolder(folders, notes, folderId);
    setFolders(result.folders);
    setNotes(result.notes);
    
    // If the selected note was in this folder, deselect it
    if (selectedNote && selectedNote.folderId === folderId) {
      setSelectedNote(null);
    }
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = deleteNote(notes, noteId);
    setNotes(updatedNotes);
    
    // If this was the selected note, deselect it
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleUpdateNoteContent = (content) => {
    if (selectedNote) {
      const updatedNotes = updateNoteContent(notes, selectedNote.id, content);
      setNotes(updatedNotes);
      
      // Update the selected note with new content
      const updatedNote = findNoteById(updatedNotes, selectedNote.id);
      if (updatedNote) {
        setSelectedNote(updatedNote);
      }
    }
  };

  const handleUpdateNoteName = (noteId, newName) => {
    if (!newName.trim()) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { ...note, name: newName.trim() };
      }
      return note;
    });
    setNotes(updatedNotes);
    
    // If we're editing the selected note, update it
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote({ ...selectedNote, name: newName.trim() });
    }
  };

  const handleUpdateFolderName = (folderId, newName) => {
    if (!newName.trim()) return;
    
    const updatedFolders = folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, name: newName.trim() };
      }
      return folder;
    });
    setFolders(updatedFolders);
  };

  const toggleFavorite = (noteId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(noteId)) {
      newFavorites.delete(noteId);
    } else {
      newFavorites.add(noteId);
    }
    setFavorites(newFavorites);
  };

  const getFavoriteNotes = () => {
    return notes.filter(note => favorites.has(note.id));
  };

  const getRecentNotes = () => {
    return [...notes]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10);
  };

  const filteredNotes = (searchQuery) => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.name.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results for dropdown
  };

  return {
    notes,
    folders,
    selectedNote,
    favorites,
    setNotes,
    setFolders,
    handleCreateFolder,
    handleCreateNote,
    handleDeleteFolder,
    handleDeleteNote,
    handleSelectNote,
    handleUpdateNoteContent,
    handleUpdateNoteName,
    handleUpdateFolderName,
    toggleFavorite,
    getFavoriteNotes,
    getRecentNotes,
    filteredNotes,
    // Utility functions
    getNotesByFolder: (folderId) => getNotesByFolder(notes, folderId),
    getRootNotes: () => getRootNotes(notes),
    findNoteById: (noteId) => findNoteById(notes, noteId)
  };
};
