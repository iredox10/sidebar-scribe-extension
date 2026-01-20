import React, { useState } from 'react';
import { 
  FaBars, FaSearch, FaFileAlt, FaStar, FaRegStar, FaEllipsisH
} from 'react-icons/fa';
import SearchContainer from './SearchContainer';
import MoreActionsDropdown from './MoreActionsDropdown';
import './Header.css';

const Header = ({
  selectedNote,
  onToggleSidebar,
  onNewNote,
  onToggleFavorite,
  favorites,
  notes,
  folders,
  onSelectNote,
  theme,
  onToggleTheme,
  onSaveToFile,
  onLoadFromFile,
  onSyncToGoogleDrive,
  onSyncToGitHub,
  onOpenSettings,
  showMoreActions,
  onToggleMoreActions,
  isFloatingMode,
  onToggleFloatingMode,
  isSyncing,
  syncError,
  lastSyncTime
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.trim().length > 0);
  };

  const handleSearchResultSelect = (note) => {
    onSelectNote(note);
    setSearchQuery('');
    setShowSearchDropdown(false);
    setShowSearch(false);
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
    setShowSearchDropdown(false);
  };

  const filteredNotes = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.name.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    ).slice(0, 8);
  };

  return (
    <header className="app-header">
      {/* Left Section: Menu + Title */}
      <div className="header-left">
        <button 
          className="menu-toggle" 
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
        >
          <FaBars />
        </button>
        <div className="header-title-container">
          {selectedNote ? (
            <span className="header-title note-title">
              {selectedNote.name.length > 25 ? selectedNote.name.substring(0, 25) + '...' : selectedNote.name}
            </span>
          ) : (
            <span className="header-title app-title">Sidebar Notes</span>
          )}
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="header-right">
        {/* Sync Status - Minimal Indicator */}
        <div className="status-area">
          {isSyncing && (
            <div className="status-dot syncing" title="Syncing..." />
          )}
          {!isSyncing && syncError && (
            <div className="status-dot error" title={`Sync Error: ${syncError}`} />
          )}
          {!isSyncing && !syncError && lastSyncTime && (
            <div className="status-dot success" title={`Synced: ${lastSyncTime.toLocaleTimeString()}`} />
          )}
        </div>

        {/* Search */}
        {!showSearch ? (
          <button 
            className="action-btn" 
            onClick={() => setShowSearch(true)}
            title="Search"
          >
            <FaSearch />
          </button>
        ) : (
          <SearchContainer
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClose={handleCloseSearch}
            showDropdown={showSearchDropdown}
            filteredNotes={filteredNotes()}
            onSelectNote={handleSearchResultSelect}
            folders={folders}
            favorites={favorites}
          />
        )}

        {/* Primary Actions */}
        <button 
          className="action-btn" 
          onClick={onNewNote}
          title="New Note"
        >
          <FaFileAlt />
        </button>
        
        {selectedNote && (
          <button 
            className={`action-btn ${favorites.has(selectedNote.id) ? 'active' : ''}`}
            onClick={() => onToggleFavorite(selectedNote.id)}
            title="Favorite"
          >
            {favorites.has(selectedNote.id) ? <FaStar /> : <FaRegStar />}
          </button>
        )}

        <div className="divider-vertical"></div>

        {/* More Menu */}
        <div className="more-actions">
          <button 
            className="action-btn"
            onClick={onToggleMoreActions}
            title="More"
          >
            <FaEllipsisH />
          </button>
          
          <MoreActionsDropdown
            show={showMoreActions}
            onClose={() => onToggleMoreActions(false)}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onSaveToFile={onSaveToFile}
            onLoadFromFile={onLoadFromFile}
            onSyncToGoogleDrive={onSyncToGoogleDrive}
            onSyncToGitHub={onSyncToGitHub}
            onOpenSettings={onOpenSettings}
            selectedNote={selectedNote}
            isFloatingMode={isFloatingMode}
            onToggleFloatingMode={onToggleFloatingMode}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
