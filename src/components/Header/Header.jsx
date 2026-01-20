import React, { useState } from 'react';
import { 
  FaBars, FaSearch, FaFileAlt, FaStar, FaRegStar, FaCog, FaSync, FaExclamationTriangle, FaCheck
} from 'react-icons/fa';
import SearchContainer from './SearchContainer';
import MoreActionsDropdown from './MoreActionsDropdown';

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
      <div className="header-content">
        {/* Compact Brand Section */}
        <div className="brand-section">
          <button 
            className="menu-toggle" 
            onClick={onToggleSidebar}
            title="Toggle Sidebar"
          >
            <FaBars />
          </button>
          <div className="brand-text">
            <span className="brand-name">Notes</span>
            {selectedNote && (
              <span className="current-note-indicator">
                • {selectedNote.name.length > 15 ? selectedNote.name.substring(0, 15) + '...' : selectedNote.name}
              </span>
            )}
          </div>
        </div>

        {/* Main Actions */}
        <div className="main-actions">
          {/* Sync Status Indicator */}
          {isSyncing && (
            <div className="sync-status syncing" title="Syncing...">
              <FaSync className="spin" />
            </div>
          )}
          {!isSyncing && syncError && (
            <div className="sync-status error" title={`Sync Error: ${syncError}`}>
              <FaExclamationTriangle />
            </div>
          )}
          {!isSyncing && !syncError && lastSyncTime && (
            <div className="sync-status success" title={`Last synced: ${lastSyncTime.toLocaleTimeString()}`}>
              <FaCheck />
            </div>
          )}

          {/* Search Toggle/Input */}
          {!showSearch ? (
            <button 
              className="action-btn search-toggle" 
              onClick={() => setShowSearch(true)}
              title="Search Notes"
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

          {/* Quick Actions Group */}
          <div className="quick-actions-group">
            <button 
              className="action-btn new-note-btn" 
              onClick={onNewNote}
              title="New Note"
            >
              <FaFileAlt />
            </button>
            
            {selectedNote && (
              <button 
                className={`action-btn favorite-btn ${favorites.has(selectedNote.id) ? 'favorited' : ''}`}
                onClick={() => onToggleFavorite(selectedNote.id)}
                title={favorites.has(selectedNote.id) ? "Remove from favorites" : "Add to favorites"}
              >
                {favorites.has(selectedNote.id) ? <FaStar /> : <FaRegStar />}
              </button>
            )}
          </div>

          {/* More Actions Dropdown */}
          <div className="more-actions">
            <button 
              className="action-btn more-toggle"
              onClick={onToggleMoreActions}
              title="More Actions"
            >
              <FaCog />
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
      </div>
    </header>
  );
};

export default Header;
