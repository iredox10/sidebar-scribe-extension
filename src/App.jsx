import { useState, useEffect } from 'react';
import { 
  FaFolder, FaFolderOpen, FaFile, FaPlus, FaTrash, 
  FaGoogleDrive, FaGithub, FaFolderPlus, FaFileAlt, FaBars
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

function App() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNoteName, setNewNoteName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Load data from chrome.storage.local on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await loadAllData();
        if (result.success) {
          setNotes(result.notes);
          setFolders(result.folders);
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

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const updatedFolders = createFolder(folders, newFolderName);
    setFolders(updatedFolders);
    setNewFolderName('');
  };

  const handleCreateNote = (folderId = null) => {
    if (!newNoteName.trim()) return;
    
    const updatedNotes = createNote(notes, newNoteName, folderId);
    setNotes(updatedNotes);
    setNewNoteName('');
  };

  const handleDeleteFolder = (folderId) => {
    const result = deleteFolder(folders, notes, folderId);
    setFolders(result.folders);
    setNotes(result.notes);
    
    // If the selected note was in this folder, deselect it
    if (selectedNote && selectedNote.folderId === folderId) {
      setSelectedNote(null);
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
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleUpdateNoteContent = (content) => {
    if (selectedNote) {
      const updatedNotes = updateNoteContent(notes, selectedNote.id, content);
      setNotes(updatedNotes);
      
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

  return (
    <div className="app">
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
          <div className="creation-controls">
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
        </div>
        
        <div className="header-right">
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
                        <span className="item-name">{note.name}</span>
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
                        <span className="item-name">{folder.name}</span>
                      </div>
                      <div className="folder-actions">
                        <button 
                          className="create-note-in-folder"
                          onClick={(e) => {
                            e.stopPropagation();
                            const noteName = prompt('Note name:');
                            if (noteName) {
                              const updatedNotes = createNote(notes, noteName, folder.id);
                              setNotes(updatedNotes);
                            }
                          }}
                          title="Create Note in Folder"
                        >
                          <FaPlus />
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
                                <span className="item-name">{note.name}</span>
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
              defaultValue={selectedNote.content}
              onChange={handleUpdateNoteContent}
              setOptions={{
                height: '100%',
                width: '100%',
                mode: 'classic',
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
              <p>Select a note to start editing or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;