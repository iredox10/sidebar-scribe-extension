import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import CreationPanel from './CreationPanel';
import NotesSection from './NotesSection';
import FolderItem from './FolderItem';

const Sidebar = ({
  show,
  onClose,
  notes,
  folders,
  selectedNote,
  favorites,
  onSelectNote,
  onToggleFavorite,
  onDeleteNote,
  onCreateNote,
  onCreateFolder,
  onDeleteFolder,
  onStartEditNote,
  onStartEditFolder,
  editingNoteId,
  editingNoteName,
  onEditingNoteNameChange,
  onSaveNoteEdit,
  editingFolderId,
  editingFolderName,
  onEditingFolderNameChange,
  onSaveFolderEdit,
  expandedFolders,
  onToggleFolder,
  getFavoriteNotes,
  getRecentNotes,
  getRootNotes,
  getNotesByFolder
}) => {
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNoteName, setNewNoteName] = useState('');

  if (!show) return null;

  const favoriteNotes = getFavoriteNotes();
  const recentNotes = getRecentNotes();
  const rootNotes = getRootNotes();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Notes</h2>
        <button 
          className="close-sidebar" 
          onClick={onClose}
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
      
      <CreationPanel
        show={showCreationPanel}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        newNoteName={newNoteName}
        setNewNoteName={setNewNoteName}
        onCreateFolder={onCreateFolder}
        onCreateNote={onCreateNote}
        onToggle={setShowCreationPanel}
      />

      <div className="file-explorer">
        {/* Favorites Section */}
        <NotesSection
          title="Favorites"
          notes={favoriteNotes}
          selectedNote={selectedNote}
          favorites={favorites}
          onSelectNote={onSelectNote}
          onToggleFavorite={onToggleFavorite}
          onDeleteNote={onDeleteNote}
          onStartEditNote={onStartEditNote}
          editingNoteId={editingNoteId}
          editingNoteName={editingNoteName}
          onEditingNoteNameChange={onEditingNoteNameChange}
          onSaveNoteEdit={onSaveNoteEdit}
        />

        {/* Recent Notes Section */}
        <NotesSection
          title="Recent Notes"
          notes={recentNotes}
          selectedNote={selectedNote}
          favorites={favorites}
          onSelectNote={onSelectNote}
          onToggleFavorite={onToggleFavorite}
          onDeleteNote={onDeleteNote}
          onStartEditNote={onStartEditNote}
          editingNoteId={editingNoteId}
          editingNoteName={editingNoteName}
          onEditingNoteNameChange={onEditingNoteNameChange}
          onSaveNoteEdit={onSaveNoteEdit}
        />

        {/* Root Notes */}
        <NotesSection
          title="Root Notes"
          notes={rootNotes}
          selectedNote={selectedNote}
          favorites={favorites}
          onSelectNote={onSelectNote}
          onToggleFavorite={onToggleFavorite}
          onDeleteNote={onDeleteNote}
          onStartEditNote={onStartEditNote}
          editingNoteId={editingNoteId}
          editingNoteName={editingNoteName}
          onEditingNoteNameChange={onEditingNoteNameChange}
          onSaveNoteEdit={onSaveNoteEdit}
        />

        {/* Folders Section */}
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
            <FolderItem
              key={folder.id}
              folder={folder}
              notes={getNotesByFolder(folder.id)}
              isExpanded={expandedFolders.has(folder.id)}
              onToggle={onToggleFolder}
              onCreateNote={onCreateNote}
              onDelete={onDeleteFolder}
              onStartEdit={onStartEditFolder}
              isEditing={editingFolderId === folder.id}
              editingName={editingFolderName}
              onEditingNameChange={onEditingFolderNameChange}
              onSaveEdit={onSaveFolderEdit}
              selectedNote={selectedNote}
              favorites={favorites}
              onSelectNote={onSelectNote}
              onToggleFavorite={onToggleFavorite}
              onDeleteNote={onDeleteNote}
              onStartEditNote={onStartEditNote}
              editingNoteId={editingNoteId}
              editingNoteName={editingNoteName}
              onEditingNoteNameChange={onEditingNoteNameChange}
              onSaveNoteEdit={onSaveNoteEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
