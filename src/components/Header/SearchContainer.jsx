import React from 'react';
import { FaSearch, FaTimes, FaFile, FaStar } from 'react-icons/fa';

// Helper function to strip markdown syntax and HTML tags
const stripMarkdown = (text) => {
  if (!text) return '';
  
  return text
    // Remove entire HTML blocks (including content)
    .replace(/<[^>]+>.*?<\/[^>]+>/gs, '')
    // Remove self-closing and remaining HTML tags
    .replace(/<[^>]*\/?>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove extra whitespace
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

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
                        {stripMarkdown(note.content).substring(0, 60)}
                        {stripMarkdown(note.content).length > 60 ? '...' : ''}
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
