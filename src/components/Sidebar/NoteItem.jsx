import React, { useEffect, useRef } from 'react';
import { FaFile, FaStar, FaRegStar, FaTrash, FaPencilAlt } from 'react-icons/fa';

const NoteItem = ({
  note,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onDelete,
  onStartEdit,
  isEditing,
  editingName,
  onEditingNameChange,
  onSaveEdit
}) => {
  const inputRef = useRef(null);

  // Debug logging to verify prop updates
  useEffect(() => {
    if (isEditing) {
      console.log(`NoteItem ${note.id} entered edit mode`);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, note.id]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSaveEdit();
    } else if (e.key === 'Escape') {
      onSaveEdit();
    }
  };

  const handleEditClick = (e) => {
    // Crucial: Stop propagation immediately
    e.preventDefault();
    e.stopPropagation();
    console.log(`Edit button clicked for ${note.id}`);
    onStartEdit(note.id, note.name);
  };

  const handleSelectClick = (e) => {
    if (!isEditing) {
      onSelect(note);
    }
  };

  return (
    <li 
      className={`note-item ${isSelected ? 'selected' : ''}`}
      onClick={handleSelectClick}
    >
      <div className="item-content">
        <FaFile className="item-icon" />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editingName}
            onChange={(e) => onEditingNameChange(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="edit-input"
          />
        ) : (
          <>
            <span className="item-name">{note.name}</span>
            <button 
              className="edit-name-btn" 
              onClick={handleEditClick}
              title="Edit Note Name"
              type="button" // Ensure it doesn't submit forms
            >
              <FaPencilAlt />
            </button>
          </>
        )}
      </div>
      <div className="note-actions">
        <button 
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(note.id);
          }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          type="button"
        >
          {isFavorite ? <FaStar /> : <FaRegStar />}
        </button>
        <button 
          className="delete-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          title="Delete Note"
          type="button"
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
};

export default NoteItem;
