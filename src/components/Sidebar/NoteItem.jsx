import React from 'react';
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
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSaveEdit();
    } else if (e.key === 'Escape') {
      onSaveEdit();
    }
  };

  return (
    <li 
      className={`note-item ${isSelected ? 'selected' : ''}`}
      onClick={() => !isEditing && onSelect(note)}
    >
      <div className="item-content">
        <FaFile className="item-icon" />
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
            <span className="item-name">{note.name}</span>
            <button 
              className="edit-name-btn" 
              onMouseDown={(e) => {
                // Prevent the mousedown from blurring any currently focused input
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit(note.id, note.name);
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
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(note.id);
          }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
};

export default NoteItem;
