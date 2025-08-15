import { useState, useEffect } from 'react';
import { 
  FaFolder, FaFolderOpen, FaFile, FaPlus, FaTrash, 
  FaGoogleDrive, FaGithub, FaFolderPlus, FaFileAlt, FaBars, 
  FaPencilAlt, FaCog, FaTimes, FaCheck
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
  const [settings, setSettings] = useState({ defaultFolder: '' });
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  // Load data from chrome.storage.local on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await loadAllData();
        if (result.success) {
          setNotes(result.notes);
          setFolders(result.folders);
          
          // Load settings
          const settingsResult = await chrome.storage.local.get(['settings']);
          if (settingsResult.settings) {
            setSettings(settingsResult.settings);
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

  // Save settings
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await chrome.storage.local.set({ settings });
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };

    saveSettings();
  }, [settings]);

  // Update note content when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setNoteContent(selectedNote.content || '');
    } else {
      setNoteContent('');
    }
  }, [selectedNote]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const updatedFolders = createFolder(folders, newFolderName);
    setFolders(updatedFolders);
    setNewFolderName('');
    setShowCreationPanel(false);
  };

  const handleCreateNote = (folderId = null) => {
    if (!newNoteName.trim()) {
      // If no name provided, create with default name
      const defaultName = `Note ${new Date().toLocaleString()}`;
      const targetFolderId = folderId || settings.defaultFolder || null;
      const updatedNotes = createNote(notes, defaultName, targetFolderId);
      setNotes(updatedNotes);
      
      // Auto-select the newly created note
      const newNote = updatedNotes[updatedNotes.length - 1];
      setSelectedNote(newNote);
      setNoteContent(newNote.content || '');
    } else {
      const targetFolderId = folderId || settings.defaultFolder || null;
      const updatedNotes = createNote(notes, newNoteName, targetFolderId);
      setNotes(updatedNotes);
      
      // Auto-select the newly created note
      const newNote = updatedNotes[updatedNotes.length - 1];
      setSelectedNote(newNote);
      setNoteContent(newNote.content || '');
      setNewNoteName('');
    }
    
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
    const noteName = `Note ${new Date().toLocaleString()}`;
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

  return (
    <div className="app">
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
            
            <div className="header-right">
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
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="explorer-section">
                    <h3>Folders</h3>
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
                                handleCreateNote(folder.id);
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
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SunEditor - Takes full width */}
            <div className="editor-container">
              {selectedNote ? (
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
          onSaveSettings={handleSaveSettings}
          onBack={() => setView('main')}
        />
      )}
    </div>
  );
}

export default App;