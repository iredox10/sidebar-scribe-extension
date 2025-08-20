import { useState, useEffect, useRef } from 'react';
import { 
  FaFolder, FaFolderOpen, FaFile, FaPlus, FaTrash, 
  FaGoogleDrive, FaGithub, FaFolderPlus, FaFileAlt, FaBars, 
  FaPencilAlt, FaCog, FaTimes, FaStar, FaRegStar, FaSearch, FaMoon, FaSun
} from 'react-icons/fa';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import './App.css';
import { loadAllData, saveAllData } from './utils/storage';
import { syncToGoogleDrive, syncToGitHub, prepareSyncData } from './utils/cloudSync';
import {
  createFolder,
  createNote,
  deleteFolder,
  deleteNote,
  updateNoteContent,
  getNotesByFolder,
  getRootNotes,
  findNoteById
} from './utils/noteOperations';
import SettingsPage from './components/SettingsPage';

function App() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNoteName, setNewNoteName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteName, setEditingNoteName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [view, setView] = useState('main'); // 'main' or 'settings'
  const [settings, setSettings] = useState({ defaultFolder: '', theme: 'light' });
  const [noteContent, setNoteContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showCreationPanel, setShowCreationPanel] = useState(false);

  // Load data from chrome.storage.local on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await loadAllData();
        if (result.success) {
          setNotes(result.notes || []);
          setFolders(result.folders || []);
          
          // Load settings
          const settingsResult = await chrome.storage.local.get(['settings']);
          if (settingsResult.settings) {
            setSettings(settingsResult.settings);
          }
          
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

  // Save settings and favorites
  useEffect(() => {
    const saveSettingsAndFavorites = async () => {
      try {
        await chrome.storage.local.set({ settings });
        await chrome.storage.local.set({ favorites: Array.from(favorites) });
      } catch (error) {
        console.error('Error saving settings and favorites:', error);
      }
    };

    saveSettingsAndFavorites();
  }, [settings, favorites]);

  // Update note content when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setNoteContent(selectedNote.content || '');
    } else {
      setNoteContent('');
    }
  }, [selectedNote]);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  // Listen for messages from the background script
  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "createNoteFromSelection") {
        const { text } = message;
        const timestamp = new Date().toLocaleString();
        const noteName = `Note from selection - ${timestamp}`;
        const targetFolderId = settings.defaultFolder || null;
        
        const newNote = {
          id: Date.now().toString(),
          name: noteName,
          content: text,
          folderId: targetFolderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setNotes(prevNotes => [...prevNotes, newNote]);
        
        // Auto-select the newly created note
        setSelectedNote(newNote);
        setNoteContent(newNote.content || '');
        setShowSidebar(true); // Ensure sidebar is open
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup the listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [settings.defaultFolder]); // Rerun if defaultFolder changes

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const timestamp = new Date().toLocaleString();
    const folderName = `${newFolderName.trim()} - ${timestamp}`;
    
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      createdAt: new Date().toISOString()
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowCreationPanel(false);
  };

  const handleCreateNote = (folderId = null) => {
    if (!newNoteName.trim()) return;
    
    const timestamp = new Date().toLocaleString();
    const noteName = `${newNoteName.trim()} - ${timestamp}`;
    
    const targetFolderId = folderId || settings.defaultFolder || null;
    
    const newNote = {
      id: Date.now().toString(),
      name: noteName,
      content: '',
      folderId: targetFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setNotes([...notes, newNote]);
    
    // Auto-select the newly created note
    setSelectedNote(newNote);
    setNoteContent(newNote.content || '');
    setNewNoteName('');
    setShowCreationPanel(false);
    setShowSidebar(false);
  };

  const handleDeleteFolder = (folderId) => {
    const result = deleteFolder(folders, notes, folderId);
    setFolders(result.folders);
    setNotes(result.notes);
    
    // If the selected note was in this folder, deselect it
    if (selectedNote && selectedNote.folderId === folderId) {
      setSelectedNote(null);
      setNoteContent('');
    }
    
    // Remove folder from expanded set
    const newExpanded = new Set(expandedFolders);
    newExpanded.delete(folderId);
    setExpandedFolders(newExpanded);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = deleteNote(notes, noteId);
    setNotes(updatedNotes);
    
    // If this was the selected note, deselect it
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null);
      setNoteContent('');
    }
  };

  const handleSelectNote = (note) => {
    // Save current note content before switching
    if (selectedNote && noteContent !== selectedNote.content) {
      handleUpdateNoteContent(noteContent);
    }
    
    setSelectedNote(note);
    setNoteContent(note.content || '');
    setShowSidebar(false); // Close sidebar when selecting a note
  };

  const handleUpdateNoteContent = (content) => {
    setNoteContent(content);
    
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

  const handleSyncToGoogleDrive = async () => {
    const syncData = prepareSyncData(notes, folders);
    const result = await syncToGoogleDrive(syncData);
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleSyncToGitHub = async () => {
    const syncData = prepareSyncData(notes, folders);
    const result = await syncToGitHub(syncData);
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const startEditingNoteName = (noteId, currentName) => {
    setEditingNoteId(noteId);
    setEditingNoteName(currentName);
  };

  const saveNoteName = () => {
    if (editingNoteId && editingNoteName.trim()) {
      const updatedNotes = notes.map(note => {
        if (note.id === editingNoteId) {
          return { ...note, name: editingNoteName.trim() };
        }
        return note;
      });
      setNotes(updatedNotes);
      
      // If we're editing the selected note, update it
      if (selectedNote && selectedNote.id === editingNoteId) {
        setSelectedNote({ ...selectedNote, name: editingNoteName.trim() });
      }
    }
    setEditingNoteId(null);
    setEditingNoteName('');
  };

  const startEditingFolderName = (folderId, currentName) => {
    setEditingFolderId(folderId);
    setEditingFolderName(currentName);
  };

  const saveFolderName = () => {
    if (editingFolderId && editingFolderName.trim()) {
      const updatedFolders = folders.map(folder => {
        if (folder.id === editingFolderId) {
          return { ...folder, name: editingFolderName.trim() };
        }
        return folder;
      });
      setFolders(updatedFolders);
    }
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    setView('main');
  };

  const quickCreateNote = () => {
    const timestamp = new Date().toLocaleString();
    const noteName = `Note ${timestamp}`;
    const targetFolderId = settings.defaultFolder || null;
    const updatedNotes = createNote(notes, noteName, targetFolderId);
    setNotes(updatedNotes);
    
    // Auto-select the newly created note
    const newNote = updatedNotes[updatedNotes.length - 1];
    setSelectedNote(newNote);
    setNoteContent(newNote.content || '');
    setShowSidebar(false);
  };

  const handleNewNoteClick = () => {
    // Clear current selection and content to create a new note
    setSelectedNote(null);
    setNoteContent('');
    setShowSidebar(false);
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

  // Filter notes based on search query
  const filteredNotes = () => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.name.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  };

  // Get favorite notes
  const getFavoriteNotes = () => {
    return notes.filter(note => favorites.has(note.id));
  };

  // Get recent notes (last 10 accessed)
  const getRecentNotes = () => {
    return [...notes]
      .sort((a, b) => new Date(b.lastAccessed || b.updatedAt) - new Date(a.lastAccessed || a.updatedAt))
      .slice(0, 10);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, theme: newTheme });
  };

  // Save note to local file
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

  // Load note from local file
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
        
        const newNote = {
          id: Date.now().toString(),
          name: noteName,
          content: content,
          folderId: settings.defaultFolder || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setNotes([...notes, newNote]);
        setSelectedNote(newNote);
        setNoteContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
      }
    };
    
    input.click();
  };

  return (
    <div className={`app theme-${settings.theme}`}>
      {view === 'main' ? (
        <>
          <header className="app-header">
            <div className="header-left">
              <button 
                className="menu-toggle" 
                onClick={() => setShowSidebar(!showSidebar)}
                title="Toggle Sidebar"
              >
                <FaBars />
              </button>
              <h1>Sidebar Note</h1>
            </div>
            
            <div className="header-center">
              {showSearch && (
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="search-input"
                    autoFocus
                  />
                  <button 
                    className="clear-search"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                    title="Clear search"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            
            <div className="header-right">
              <button 
                className="search-toggle" 
                onClick={() => setShowSearch(!showSearch)}
                title="Search"
              >
                <FaSearch />
              </button>
              <button 
                className="theme-toggle" 
                onClick={toggleTheme}
                title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {settings.theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
              <button 
                className="save-file-btn" 
                onClick={saveToLocalFile}
                title="Save to file"
                disabled={!selectedNote}
              >
                <FaFile />
              </button>
              <button 
                className="load-file-btn" 
                onClick={loadFromLocalFile}
                title="Load from file"
              >
                <FaFolderOpen />
              </button>
              <button 
                className="quick-create-btn" 
                onClick={handleNewNoteClick}
                title="New Note"
              >
                <FaFileAlt />
              </button>
              <button 
                className="settings-btn" 
                onClick={() => setView('settings')}
                title="Settings"
              >
                <FaCog />
              </button>
              <div className="sync-buttons">
                <button onClick={handleSyncToGoogleDrive} className="sync-btn" title="Sync to Google Drive">
                  <FaGoogleDrive />
                </button>
                <button onClick={handleSyncToGitHub} className="sync-btn" title="Sync to GitHub">
                  <FaGithub />
                </button>
              </div>
            </div>
          </header>

          <div className="main-content">
            {showSidebar && (
              <div className="sidebar">
                <div className="sidebar-header">
                  <h2>Notes</h2>
                  <button 
                    className="close-sidebar" 
                    onClick={() => setShowSidebar(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <button 
                  className="show-creation-panel"
                  onClick={() => setShowCreationPanel(!showCreationPanel)}
                >
                  {showCreationPanel ? <FaTimes /> : <FaPlus />} 
                  {showCreationPanel ? 'Cancel' : 'New'}
                </button>
                
                {showCreationPanel && (
                  <div className="creation-panel">
                    <div className="input-group">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name"
                        className="creation-input"
                      />
                      <button onClick={handleCreateFolder} className="icon-button" title="Create Folder">
                        <FaFolderPlus />
                      </button>
                    </div>
                    
                    <div className="input-group">
                      <input
                        type="text"
                        value={newNoteName}
                        onChange={(e) => setNewNoteName(e.target.value)}
                        placeholder="Note name"
                        className="creation-input"
                      />
                      <button onClick={() => handleCreateNote()} className="icon-button" title="Create Note">
                        <FaFileAlt />
                      </button>
                    </div>
                  </div>
                )}

                <div className="file-explorer">
                  {/* Search Results */}
                  {searchQuery && (
                    <div className="explorer-section">
                      <h3>Search Results</h3>
                      <ul className="notes-list">
                        {filteredNotes().map(note => (
                          <li 
                            key={note.id} 
                            className={`note-item ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                            onClick={() => handleSelectNote(note)}
                          >
                            <div className="item-content">
                              <FaFile className="item-icon" />
                              <span className="item-name">{note.name}</span>
                              {favorites.has(note.id) && <FaStar className="favorite-icon" />}
                            </div>
                            <div className="note-actions">
                              <button 
                                className={`favorite-btn ${favorites.has(note.id) ? 'favorited' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(note.id);
                                }}
                                title={favorites.has(note.id) ? "Remove from favorites" : "Add to favorites"}
                              >
                                {favorites.has(note.id) ? <FaStar /> : <FaRegStar />}
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                title="Delete Note"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Favorites Section */}
                  {!searchQuery && getFavoriteNotes().length > 0 && (
                    <div className="explorer-section">
                      <h3>Favorites</h3>
                      <ul className="notes-list">
                        {getFavoriteNotes().map(note => (
                          <li 
                            key={note.id} 
                            className={`note-item ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                            onClick={() => handleSelectNote(note)}
                          >
                            <div className="item-content">
                              <FaStar className="item-icon favorite-icon" />
                              <span className="item-name">{note.name}</span>
                            </div>
                            <div className="note-actions">
                              <button 
                                className={`favorite-btn ${favorites.has(note.id) ? 'favorited' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(note.id);
                                }}
                                title={favorites.has(note.id) ? "Remove from favorites" : "Add to favorites"}
                              >
                                {favorites.has(note.id) ? <FaStar /> : <FaRegStar />}
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                title="Delete Note"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recent Notes Section */}
                  {!searchQuery && (
                    <div className="explorer-section">
                      <h3>Recent Notes</h3>
                      <ul className="notes-list">
                        {getRecentNotes().map(note => (
                          <li 
                            key={note.id} 
                            className={`note-item ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                            onClick={() => handleSelectNote(note)}
                          >
                            <div className="item-content">
                              <FaFile className="item-icon" />
                              <span className="item-name">{note.name}</span>
                              {favorites.has(note.id) && <FaStar className="favorite-icon" />}
                            </div>
                            <div className="note-actions">
                              <button 
                                className={`favorite-btn ${favorites.has(note.id) ? 'favorited' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(note.id);
                                }}
                                title={favorites.has(note.id) ? "Remove from favorites" : "Add to favorites"}
                              >
                                {favorites.has(note.id) ? <FaStar /> : <FaRegStar />}
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                title="Delete Note"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Root Notes */}
                  {!searchQuery && (
                    <div className="explorer-section">
                      <h3>Root Notes</h3>
                      <ul className="notes-list">
                        {getRootNotes(notes).map(note => (
                          <li 
                            key={note.id} 
                            className={`note-item ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                            onClick={() => handleSelectNote(note)}
                          >
                            <div className="item-content">
                              <FaFile className="item-icon" />
                              {editingNoteId === note.id ? (
                                <input
                                  type="text"
                                  value={editingNoteName}
                                  onChange={(e) => setEditingNoteName(e.target.value)}
                                  onBlur={saveNoteName}
                                  onKeyDown={(e) => e.key === 'Enter' && saveNoteName()}
                                  autoFocus
                                  className="edit-input"
                                />
                              ) : (
                                <>
                                  <span className="item-name">{note.name}</span>
                                  <button 
                                    className="edit-name-btn" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditingNoteName(note.id, note.name);
                                    }}
                                    title="Edit Note Name"
                                  >
                                    <FaPencilAlt />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="note-actions">
                              <button 
                                className={`favorite-btn ${favorites.has(note.id) ? 'favorited' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(note.id);
                                }}
                                title={favorites.has(note.id) ? "Remove from favorites" : "Add to favorites"}
                              >
                                {favorites.has(note.id) ? <FaStar /> : <FaRegStar />}
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                                title="Delete Note"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Folders Section */}
                  {!searchQuery && (
                    <div className="explorer-section">
                      <div className="section-header">
                        <h3>Folders</h3>
                        <button 
                          className="add-folder-btn"
                          onClick={() => {
                            setNewFolderName('');
                            setShowCreationPanel(true);
                          }}
                          title="Add New Folder"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      {folders.map(folder => (
                        <div key={folder.id} className="folder">
                          <div 
                            className="folder-header"
                            onClick={() => toggleFolder(folder.id)}
                          >
                            <div className="item-content">
                              {expandedFolders.has(folder.id) ? 
                                <FaFolderOpen className="item-icon" /> : 
                                <FaFolder className="item-icon" />
                              }
                              {editingFolderId === folder.id ? (
                                <input
                                  type="text"
                                  value={editingFolderName}
                                  onChange={(e) => setEditingFolderName(e.target.value)}
                                  onBlur={saveFolderName}
                                  onKeyDown={(e) => e.key === 'Enter' && saveFolderName()}
                                  autoFocus
                                  className="edit-input"
                                />
                              ) : (
                                <>
                                  <span className="item-name">{folder.name}</span>
                                  <button 
                                    className="edit-name-btn" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditingFolderName(folder.id, folder.name);
                                    }}
                                    title="Edit Folder Name"
                                  >
                                    <FaPencilAlt />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="folder-actions">
                              <button 
                                className="create-note-in-folder"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const noteName = prompt('Note name:');
                                  if (noteName) {
                                    handleCreateNote(folder.id);
                                  }
                                }}
                                title="Create Note in Folder"
                              >
                                <FaFileAlt />
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFolder(folder.id);
                                }}
                                title="Delete Folder"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          
                          {expandedFolders.has(folder.id) && (
                            <div className="folder-content">
                              <ul className="notes-list">
                                {getNotesByFolder(notes, folder.id).map(note => (
                                  <li 
                                    key={note.id} 
                                    className={`note-item ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectNote(note)}
                                  >
                                    <div className="item-content">
                                      <FaFile className="item-icon" />
                                      {editingNoteId === note.id ? (
                                        <input
                                          type="text"
                                          value={editingNoteName}
                                          onChange={(e) => setEditingNoteName(e.target.value)}
                                          onBlur={saveNoteName}
                                          onKeyDown={(e) => e.key === 'Enter' && saveNoteName()}
                                          autoFocus
                                          className="edit-input"
                                        />
                                      ) : (
                                        <>
                                          <span className="item-name">{note.name}</span>
                                          <button 
                                            className="edit-name-btn" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              startEditingNoteName(note.id, note.name);
                                            }}
                                            title="Edit Note Name"
                                          >
                                            <FaPencilAlt />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                    <div className="note-actions">
                                      <button 
                                        className={`favorite-btn ${favorites.has(note.id) ? 'favorited' : ''}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavorite(note.id);
                                        }}
                                        title={favorites.has(note.id) ? "Remove from favorites" : "Add to favorites"}
                                      >
                                        {favorites.has(note.id) ? <FaStar /> : <FaRegStar />}
                                      </button>
                                      <button 
                                        className="delete-btn" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteNote(note.id);
                                        }}
                                        title="Delete Note"
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SunEditor - Takes full width */}
            <div className="editor-container">
              {selectedNote ? (
                <div className="editor-wrapper">
                  <div className="editor-header">
                    <h2>{selectedNote.name}</h2>
                    <div className="editor-actions">
                      <button 
                        className={`favorite-toggle ${favorites.has(selectedNote.id) ? 'favorited' : ''}`}
                        onClick={() => toggleFavorite(selectedNote.id)}
                        title={favorites.has(selectedNote.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.has(selectedNote.id) ? <FaStar /> : <FaRegStar />}
                      </button>
                      <button 
                        className="save-file-btn" 
                        onClick={saveToLocalFile}
                        title="Save to file"
                      >
                        <FaFile />
                      </button>
                    </div>
                  </div>
                  <SunEditor
                    key={selectedNote.id} // Add key to force re-render when note changes
                    defaultValue={noteContent}
                    onChange={handleUpdateNoteContent}
                    setOptions={{
                      height: '100%',
                      width: '100%',
                      mode: 'classic',
                      font: 'Arial, Helvetica, sans-serif',
                      fontSize: 16,
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor'],
                        ['removeFormat'],
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'table'],
                        ['link', 'image', 'video'],
                        ['fullScreen', 'showBlocks', 'codeView'],
                        ['print'],
                      ],
                      resizingBar: false,
                      charCounter: true,
                    }}
                  />
                </div>
              ) : (
                <div className="no-note-selected">
                  <div className="welcome-message">
                    <h2>New Note</h2>
                    <p>Start writing your note below</p>
                    <div className="quick-actions">
                      <button 
                        className="welcome-btn" 
                        onClick={quickCreateNote}
                      >
                        <FaFileAlt /> Create Note with Timestamp
                      </button>
                      <button 
                        className="welcome-btn" 
                        onClick={loadFromLocalFile}
                      >
                        <FaFolderOpen /> Load from File
                      </button>
                    </div>
                  </div>
                  <SunEditor
                    key="new-note" // Add key to force re-render for new notes
                    defaultValue=""
                    onChange={handleUpdateNoteContent}
                    setOptions={{
                      height: '100%',
                      width: '100%',
                      mode: 'classic',
                      font: 'Arial, Helvetica, sans-serif',
                      fontSize: 16,
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor'],
                        ['removeFormat'],
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'table'],
                        ['link', 'image', 'video'],
                        ['fullScreen', 'showBlocks', 'codeView'],
                        ['print'],
                      ],
                      resizingBar: false,
                      charCounter: true,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <SettingsPage 
          folders={folders}
          defaultFolder={settings.defaultFolder}
          theme={settings.theme}
          onSaveSettings={handleSaveSettings}
          onBack={() => setView('main')}
        />
      )}
    </div>
  );
}

export default App;