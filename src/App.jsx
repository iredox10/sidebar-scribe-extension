import React from 'react';
import './App.css';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Editor from './components/Editor/Editor.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import AllNotesView from './components/AllNotesView.jsx';
import MessageListener from './components/UI/MessageListener.jsx';
import FloatingWindow from './components/UI/FloatingWindow.jsx';
import ConfirmDialog from './components/UI/ConfirmDialog.jsx';
import { useNotes } from './hooks/useNotes.js';
import { useSettings } from './hooks/useSettings.js';
import { useUI } from './hooks/useUI.js';
import { useEditing } from './hooks/useEditing.js';
import { useFileOperations } from './hooks/useFileOperations.js';

function App() {
  console.log('🚀 App component loading with full integration...');
  
  try {
    // Initialize all hooks
    const notesState = useNotes();
    const settingsState = useSettings();
    const uiState = useUI();
    const editingState = useEditing(notesState);
    const fileOpsState = useFileOperations(
      notesState.notes, 
      notesState.folders, 
      notesState.selectedNote, 
      notesState.handleCreateNote, 
      settingsState.settings.defaultFolder
    );

    // Local state for editor content
    const [noteContent, setNoteContent] = React.useState('');
    
    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = React.useState({
      show: false,
      title: '',
      message: '',
      onConfirm: null,
      type: 'danger'
    });

    console.log('✅ All hooks initialized successfully');

    // Apply theme
    React.useEffect(() => {
      document.documentElement.setAttribute('data-theme', settingsState.settings.theme);
    }, [settingsState.settings.theme]);

    // Update note content when selected note changes
    React.useEffect(() => {
      if (notesState.selectedNote) {
        setNoteContent(notesState.selectedNote.content || '');
      } else {
        setNoteContent('');
      }
    }, [notesState.selectedNote]);

    // Handler functions
    const handleNoteSelect = (note) => {
      // Save current note content before switching
      if (notesState.selectedNote && noteContent !== notesState.selectedNote.content) {
        notesState.handleUpdateNoteContent(noteContent);
      }
      
      notesState.handleSelectNote(note);
      setNoteContent(note.content || '');
      uiState.closeSidebar();
    };

    const handleContentUpdate = (content) => {
      setNoteContent(content);
      notesState.handleUpdateNoteContent(content);
    };

    const quickCreateNote = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
      const noteName = `New - ${timestamp}`;
      const newNote = notesState.handleCreateNote(noteName, settingsState.settings.defaultFolder);
      
      if (newNote) {
        notesState.handleSelectNote(newNote);
        setNoteContent(newNote.content || '');
        uiState.closeSidebar();
      }
    };

    const handleCreateNoteFromSelection = (newNote) => {
      // Add the note to our notes array at the top
      notesState.setNotes(prevNotes => [newNote, ...prevNotes]);
      // Select the new note for editing
      notesState.handleSelectNote(newNote);
      setNoteContent(newNote.content || '');
      uiState.closeSidebar();
    };

    // Wrapped delete handlers with confirmation
    const handleDeleteNoteWithConfirm = (noteId) => {
      const note = notesState.notes.find(n => n.id === noteId);
      if (!note) return;

      setConfirmDialog({
        show: true,
        title: 'Delete Note?',
        message: `Are you sure you want to delete "${note.name}"? This action cannot be undone.`,
        onConfirm: () => {
          notesState.handleDeleteNote(noteId);
          setConfirmDialog({ ...confirmDialog, show: false });
        },
        type: 'danger'
      });
    };

    const handleDeleteFolderWithConfirm = (folderId) => {
      const folder = notesState.folders.find(f => f.id === folderId);
      if (!folder) return;

      const notesInFolder = notesState.getNotesByFolder(folderId);
      const noteCount = notesInFolder.length;

      setConfirmDialog({
        show: true,
        title: 'Delete Folder?',
        message: `Are you sure you want to delete the folder "${folder.name}"?${noteCount > 0 ? ` This will also delete ${noteCount} note${noteCount > 1 ? 's' : ''} inside it.` : ''} This action cannot be undone.`,
        onConfirm: () => {
          notesState.handleDeleteFolder(folderId);
          setConfirmDialog({ ...confirmDialog, show: false });
        },
        type: 'danger'
      });
    };

    const closeConfirmDialog = () => {
      setConfirmDialog({ ...confirmDialog, show: false });
    };

    const handleAppendToCurrentNote = (text) => {
      console.log("🔧 handleAppendToCurrentNote called");
      console.log("Selected note:", notesState.selectedNote);
      console.log("Current content length:", noteContent.length);
      console.log("Text to append:", text);
      
      if (notesState.selectedNote) {
        // Append the text to the current note content with formatting
        const separator = noteContent.trim() ? '\n\n---\n\n' : '';
        const timestamp = new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        const formattedText = `${separator}**Added on ${timestamp}:**\n\n${text}`;
        const newContent = noteContent + formattedText;
        
        console.log("✅ New content created, length:", newContent.length);
        console.log("First 100 chars:", newContent.substring(0, 100));
        
        // Update local state first
        setNoteContent(newContent);
        
        // Then update the note in storage
        notesState.handleUpdateNoteContent(newContent);
        
        console.log("✅ Content update completed");
      } else {
        console.log("❌ No note selected, cannot append");
      }
    };

    const appContent = uiState.view === 'settings' ? (
      <SettingsPage
        folders={notesState.folders}
        defaultFolder={settingsState.settings.defaultFolder}
        theme={settingsState.settings.theme}
        onSaveSettings={(newSettings) => {
          settingsState.updateSettings(newSettings);
          uiState.setView('main');
        }}
        onBack={() => uiState.setView('main')}
      />
    ) : uiState.view === 'all-notes' ? (
      <AllNotesView
        category={uiState.notesViewCategory}
        notes={uiState.notesViewCategory === 'recent' ? notesState.getRecentNotes() : 
               uiState.notesViewCategory === 'root' ? notesState.getRootNotes() : []}
        folders={uiState.notesViewCategory === 'folders' ? notesState.folders : []}
        selectedNote={notesState.selectedNote}
        favorites={notesState.favorites}
        onSelectNote={handleNoteSelect}
        onToggleFavorite={notesState.toggleFavorite}
        onDeleteNote={handleDeleteNoteWithConfirm}
        onStartEditNote={editingState.startEditingNoteName}
        editingNoteId={editingState.editingNoteId}
        editingNoteName={editingState.editingNoteName}
        onEditingNoteNameChange={editingState.setEditingNoteName}
        onSaveNoteEdit={() => {
          if (editingState.editingNoteId && editingState.editingNoteName.trim()) {
            notesState.handleUpdateNoteName(editingState.editingNoteId, editingState.editingNoteName);
          }
          editingState.cancelEditing();
        }}
        onBack={uiState.backToMain}
        expandedFolders={uiState.expandedFolders}
        onToggleFolder={uiState.toggleFolder}
        getNotesByFolder={notesState.getNotesByFolder}
        onDeleteFolder={handleDeleteFolderWithConfirm}
        onStartEditFolder={editingState.startEditingFolderName}
        editingFolderId={editingState.editingFolderId}
        editingFolderName={editingState.editingFolderName}
        onEditingFolderNameChange={editingState.setEditingFolderName}
        onSaveFolderEdit={() => {
          if (editingState.editingFolderId && editingState.editingFolderName.trim()) {
            notesState.handleUpdateFolderName(editingState.editingFolderId, editingState.editingFolderName);
          }
          editingState.cancelEditing();
        }}
        onCreateNote={notesState.handleCreateNote}
      />
    ) : (
      <>
        <Header 
          selectedNote={notesState.selectedNote}
          onToggleSidebar={uiState.toggleSidebar}
          onNewNote={() => {
            notesState.handleSelectNote(null);
            setNoteContent('');
            uiState.closeSidebar();
          }}
          onToggleFavorite={notesState.toggleFavorite}
          favorites={notesState.favorites}
          notes={notesState.notes}
          folders={notesState.folders}
          onSelectNote={handleNoteSelect}
          theme={settingsState.settings.theme}
          onToggleTheme={settingsState.toggleTheme}
          onSaveToFile={fileOpsState.saveToLocalFile}
          onLoadFromFile={fileOpsState.loadFromLocalFile}
          onSyncToGoogleDrive={fileOpsState.syncToGoogleDrive}
          onSyncToGitHub={fileOpsState.syncToGitHub}
          onOpenSettings={() => uiState.setView('settings')}
          showMoreActions={uiState.showMoreActions}
          onToggleMoreActions={uiState.setShowMoreActions}
          isFloatingMode={uiState.isFloatingMode}
          onToggleFloatingMode={uiState.toggleFloatingMode}
        />

        <div className="main-content">
          <Sidebar
            show={uiState.showSidebar}
            onClose={uiState.closeSidebar}
            notes={notesState.notes}
            folders={notesState.folders}
            selectedNote={notesState.selectedNote}
            favorites={notesState.favorites}
            onSelectNote={handleNoteSelect}
            onToggleFavorite={notesState.toggleFavorite}
            onDeleteNote={handleDeleteNoteWithConfirm}
            onCreateNote={notesState.handleCreateNote}
            onCreateFolder={notesState.handleCreateFolder}
            onDeleteFolder={handleDeleteFolderWithConfirm}
            onStartEditNote={editingState.startEditingNoteName}
            onStartEditFolder={editingState.startEditingFolderName}
            editingNoteId={editingState.editingNoteId}
            editingNoteName={editingState.editingNoteName}
            onEditingNoteNameChange={editingState.setEditingNoteName}
            onSaveNoteEdit={() => {
              if (editingState.editingNoteId && editingState.editingNoteName.trim()) {
                notesState.handleUpdateNoteName(editingState.editingNoteId, editingState.editingNoteName);
              }
              editingState.cancelEditing();
            }}
            editingFolderId={editingState.editingFolderId}
            editingFolderName={editingState.editingFolderName}
            onEditingFolderNameChange={editingState.setEditingFolderName}
            onSaveFolderEdit={() => {
              if (editingState.editingFolderId && editingState.editingFolderName.trim()) {
                notesState.handleUpdateFolderName(editingState.editingFolderId, editingState.editingFolderName);
              }
              editingState.cancelEditing();
            }}
            expandedFolders={uiState.expandedFolders}
            onToggleFolder={uiState.toggleFolder}
            getFavoriteNotes={notesState.getFavoriteNotes}
            getRecentNotes={notesState.getRecentNotes}
            getRootNotes={notesState.getRootNotes}
            getNotesByFolder={notesState.getNotesByFolder}
            onShowMoreRecent={() => uiState.showAllNotes('recent')}
            onShowMoreRoot={() => uiState.showAllNotes('root')}
            onShowMoreFolders={() => uiState.showAllNotes('folders')}
          />

          <Editor
            selectedNote={notesState.selectedNote}
            noteContent={noteContent}
            onUpdateContent={handleContentUpdate}
            favorites={notesState.favorites}
            onToggleFavorite={notesState.toggleFavorite}
            onSaveToFile={fileOpsState.saveToLocalFile}
            onQuickCreateNote={quickCreateNote}
            onLoadFromFile={fileOpsState.loadFromLocalFile}
            theme={settingsState.settings.theme}
          />
        </div>
      </>
    );

    return (
      <div className="app">
        <MessageListener 
          onCreateNoteFromSelection={handleCreateNoteFromSelection}
          onAppendToCurrentNote={handleAppendToCurrentNote}
          currentNote={notesState.selectedNote}
          defaultFolderId={settingsState.settings.defaultFolder}
        />
        
        {uiState.isFloatingMode ? (
          <FloatingWindow
            isOpen={true}
            onClose={uiState.toggleFloatingMode}
            title="Side Note"
            isPinned={uiState.isFloatingPinned}
            onTogglePin={uiState.toggleFloatingPin}
          >
            {appContent}
          </FloatingWindow>
        ) : (
          appContent
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          show={confirmDialog.show}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={closeConfirmDialog}
          type={confirmDialog.type}
        />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading components:', error);
    return (
      <div className="app" style={{ padding: '20px' }}>
        <h1>🚨 Component Loading Error</h1>
        <p><strong>Error:</strong> {error.message}</p>
        <details style={{ marginTop: '10px' }}>
          <summary>Click for Error Details</summary>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {error.stack}
          </pre>
        </details>
        <div style={{ marginTop: '20px', padding: '10px', background: '#fff3cd', borderRadius: '5px' }}>
          <h3>Troubleshooting Steps:</h3>
          <ol>
            <li>Check the browser console for detailed errors</li>
            <li>Verify all component files exist in the components/ folder</li>
            <li>Ensure all hook files exist in the hooks/ folder</li>
            <li>Rebuild the extension: npm run build</li>
          </ol>
        </div>
      </div>
    );
  }
}

export default App;