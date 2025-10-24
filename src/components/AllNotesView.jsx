import React, { useState, useMemo } from 'react';
import { FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import NotesSection from './Sidebar/NotesSection';
import FolderItem from './Sidebar/FolderItem';

const AllNotesView = ({
  category,
  notes,
  folders,
  selectedNote,
  favorites,
  onSelectNote,
  onToggleFavorite,
  onDeleteNote,
  onStartEditNote,
  editingNoteId,
  editingNoteName,
  onEditingNoteNameChange,
  onSaveNoteEdit,
  onBack,
  expandedFolders,
  onToggleFolder,
  getNotesByFolder,
  onDeleteFolder,
  onStartEditFolder,
  editingFolderId,
  editingFolderName,
  onEditingFolderNameChange,
  onSaveFolderEdit,
  onCreateNote
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryTitle = () => {
    switch(category) {
      case 'recent':
        return 'All Recent Notes';
      case 'root':
        return 'All Root Notes';
      case 'folders':
        return 'All Folders';
      default:
        return 'All Items';
    }
  };

  const categoryTitle = getCategoryTitle();

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim() || !notes) return notes || [];
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.name.toLowerCase().includes(query) ||
      (note.content && note.content.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim() || !folders) return folders || [];
    const query = searchQuery.toLowerCase();
    return folders.filter(folder => 
      folder.name.toLowerCase().includes(query)
    );
  }, [folders, searchQuery]);

  const handleCreateNoteInFolder = (folderId) => {
    const newNote = onCreateNote(null, folderId);
    if (newNote) {
      onStartEditNote(newNote.id, newNote.name);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="all-notes-view">
      <div className="all-notes-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>{categoryTitle}</h2>
      </div>

      {/* Search Bar */}
      <div className="all-notes-search">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${category === 'folders' ? 'folders' : 'notes'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={handleClearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      <div className="all-notes-content">
        {category === 'folders' ? (
          <>
            {filteredFolders.map(folder => (
              <FolderItem
                key={folder.id}
                folder={folder}
                notes={getNotesByFolder(folder.id)}
                isExpanded={expandedFolders?.has(folder.id)}
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
            {filteredFolders.length === 0 && (
              <div className="empty-state">
                <p>{searchQuery ? 'No folders match your search.' : 'No folders found.'}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <NotesSection
              notes={filteredNotes}
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
            />
            
            {filteredNotes.length === 0 && (
              <div className="empty-state">
                <p>{searchQuery ? 'No notes match your search.' : 'No notes found in this category.'}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllNotesView;
