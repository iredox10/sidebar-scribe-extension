import React from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
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
  getNotesByFolder,
  onShowMoreRecent,
  onShowMoreRoot,
  onShowMoreFolders
}) => {
  if (!show) return null;

  const favoriteNotes = getFavoriteNotes();
  const recentNotes = getRecentNotes();
  const rootNotes = getRootNotes();

  // Instant creation handlers
  const handleCreateNewNote = () => {
    const newNote = onCreateNote(null, null); // Create in root with default name
    if (newNote) {
      onStartEditNote(newNote.id, newNote.name);
    }
  };

  const handleCreateNewFolder = () => {
    const newFolder = onCreateFolder(null); // Create with default name
    if (newFolder) {
      onStartEditFolder(newFolder.id, newFolder.name);
    }
  };

  const handleCreateNoteInFolder = (folderId) => {
    const newNote = onCreateNote(null, folderId); // Create with default name in folder
    if (newNote) {
      onStartEditNote(newNote.id, newNote.name);
    }
  };

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
          limit={3}
          onShowMore={onShowMoreRecent}
        />

        {/* Root Notes */}
        <div className="explorer-section">
          <div className="section-header">
            <h3>Root Notes</h3>
            <button 
              className="add-note-btn"
              onClick={handleCreateNewNote}
              title="Add New Note"
            >
              <FaPlus />
            </button>
          </div>
          <NotesSection
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
            showTitle={false}
            limit={3}
            onShowMore={onShowMoreRoot}
          />
        </div>

        {/* Folders Section */}
        <div className="explorer-section">
          <div className="section-header">
            <h3>Folders</h3>
            <button 
              className="add-folder-btn"
              onClick={handleCreateNewFolder}
              title="Add New Folder"
            >
              <FaPlus />
            </button>
          </div>
          {folders.slice(0, 3).map(folder => (
            <FolderItem
              key={folder.id}
              folder={folder}
              notes={getNotesByFolder(folder.id)}
              isExpanded={expandedFolders.has(folder.id)}
              onToggle={onToggleFolder}
              onCreateNote={handleCreateNoteInFolder}
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
          {folders.length > 3 && (
            <button className="show-more-btn" onClick={onShowMoreFolders}>
              Show More ({folders.length - 3} more)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
