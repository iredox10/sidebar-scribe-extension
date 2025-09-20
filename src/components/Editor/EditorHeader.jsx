import React from 'react';
import { FaStar, FaRegStar, FaFile } from 'react-icons/fa';

const EditorHeader = ({ 
  selectedNote, 
  favorites, 
  onToggleFavorite, 
  onSaveToFile 
}) => {
  if (!selectedNote) return null;

  return (
    <div className="editor-header">
      <h2>{selectedNote.name}</h2>
      <div className="editor-actions">
        <button 
          className={`favorite-toggle ${favorites.has(selectedNote.id) ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(selectedNote.id)}
          title={favorites.has(selectedNote.id) ? "Remove from favorites" : "Add to favorites"}
        >
          {favorites.has(selectedNote.id) ? <FaStar /> : <FaRegStar />}
        </button>
        <button 
          className="save-file-btn" 
          onClick={onSaveToFile}
          title="Save to file"
        >
          <FaFile />
        </button>
      </div>
    </div>
  );
};

export default EditorHeader;
