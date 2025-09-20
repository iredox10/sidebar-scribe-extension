import React from 'react';
import { FaSearch, FaTimes, FaFile, FaStar } from 'react-icons/fa';

const SearchContainer = ({ 
  searchQuery, 
  onSearchChange, 
  onClose, 
  showDropdown, 
  filteredNotes, 
  onSelectNote, 
  folders, 
  favorites 
}) => {
  return (
    <div className="search-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search..."
        className="search-input"
        autoFocus
        onBlur={() => {
          if (!searchQuery.trim()) {
            onClose();
          }
        }}
      />
      <button 
        className="clear-search"
        onClick={onClose}
        title="Close search"
      >
        <FaTimes />
      </button>
      
      {/* Search Results Dropdown */}
      {showDropdown && filteredNotes.length > 0 && (
        <div className="search-dropdown">
          {filteredNotes.map(note => {
            const folderName = note.folderId 
              ? folders.find(f => f.id === note.folderId)?.name 
              : 'Root';
            
            return (
              <div
                key={note.id}
                className="search-result-item"
                onClick={() => onSelectNote(note)}
              >
                <div className="search-result-main">
                  <FaFile className="search-result-icon" />
                  <div className="search-result-content">
                    <div className="search-result-title">{note.name}</div>
                    <div className="search-result-path">in {folderName}</div>
                    {note.content && (
                      <div className="search-result-preview">
                        {note.content.substring(0, 60)}
                        {note.content.length > 60 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </div>
                {favorites.has(note.id) && (
                  <FaStar className="search-result-favorite" />
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* No results message */}
      {showDropdown && searchQuery.trim() && filteredNotes.length === 0 && (
        <div className="search-dropdown">
          <div className="search-no-results">
            No notes found for "{searchQuery}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
