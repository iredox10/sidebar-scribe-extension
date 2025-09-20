import React from 'react';
import { 
  FaFile, FaFolderOpen, FaGoogleDrive, FaGithub, 
  FaCog, FaMoon, FaSun 
} from 'react-icons/fa';

const MoreActionsDropdown = ({ 
  show, 
  onClose, 
  theme, 
  onToggleTheme, 
  onSaveToFile, 
  onLoadFromFile, 
  onSyncToGoogleDrive, 
  onSyncToGitHub, 
  onOpenSettings,
  selectedNote 
}) => {
  if (!show) return null;

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <div className="more-dropdown">
      <button 
        className="dropdown-item theme-toggle" 
        onClick={() => handleAction(onToggleTheme)}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
        <span>Theme</span>
      </button>
      
      <button 
        className="dropdown-item" 
        onClick={() => handleAction(onSaveToFile)}
        title="Save to file"
        disabled={!selectedNote}
      >
        <FaFile />
        <span>Save</span>
      </button>
      
      <button 
        className="dropdown-item" 
        onClick={() => handleAction(onLoadFromFile)}
        title="Load from file"
      >
        <FaFolderOpen />
        <span>Load</span>
      </button>
      
      <div className="dropdown-divider"></div>
      
      <button 
        className="dropdown-item" 
        onClick={() => handleAction(onSyncToGoogleDrive)}
        title="Sync to Google Drive"
      >
        <FaGoogleDrive />
        <span>Drive</span>
      </button>
      
      <button 
        className="dropdown-item" 
        onClick={() => handleAction(onSyncToGitHub)}
        title="Sync to GitHub"
      >
        <FaGithub />
        <span>GitHub</span>
      </button>
      
      <div className="dropdown-divider"></div>
      
      <button 
        className="dropdown-item" 
        onClick={() => handleAction(onOpenSettings)}
        title="Settings"
      >
        <FaCog />
        <span>Settings</span>
      </button>
    </div>
  );
};

export default MoreActionsDropdown;
