import React from 'react';
import { FaFolder, FaFolderOpen, FaFileAlt, FaTrash, FaPencilAlt } from 'react-icons/fa';
import NoteItem from './NoteItem';

const FolderItem = ({
  folder,
  notes,
  isExpanded,
  onToggle,
  onCreateNote,
  onDelete,
  onStartEdit,
  isEditing,
  editingName,
  onEditingNameChange,
  onSaveEdit,
  selectedNote,
  favorites,
  onSelectNote,
  onToggleFavorite,
  onDeleteNote,
  onStartEditNote,
  editingNoteId,
  editingNoteName,
  onEditingNoteNameChange,
  onSaveNoteEdit
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSaveEdit();
    } else if (e.key === 'Escape') {
      onSaveEdit();
    }
  };

  const handleCreateNote = (e) => {
    e.stopPropagation();
    onCreateNote(folder.id);
  };

  return (
    <div className="folder">
      <div 
        className="folder-header"
        onClick={() => !isEditing && onToggle(folder.id)}
      >
        <div className="item-content">
          {isExpanded ? 
            <FaFolderOpen className="item-icon" /> : 
            <FaFolder className="item-icon" />
          }
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
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
                  onStartEdit(folder.id, folder.name);
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
            onClick={handleCreateNote}
            title="Create Note in Folder"
          >
            <FaFileAlt />
          </button>
          <button 
            className="delete-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder.id);
            }}
            title="Delete Folder"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="folder-content">
          <ul className="notes-list">
            {notes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                isSelected={selectedNote && selectedNote.id === note.id}
                isFavorite={favorites.has(note.id)}
                onSelect={onSelectNote}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDeleteNote}
                onStartEdit={onStartEditNote}
                isEditing={editingNoteId === note.id}
                editingName={editingNoteName}
                onEditingNameChange={onEditingNoteNameChange}
                onSaveEdit={onSaveNoteEdit}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FolderItem;
