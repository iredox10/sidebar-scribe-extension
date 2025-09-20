import React from 'react';
import { FaPlus, FaFolderPlus, FaFileAlt, FaTimes } from 'react-icons/fa';

const CreationPanel = ({
  show,
  newFolderName,
  setNewFolderName,
  newNoteName,
  setNewNoteName,
  onCreateFolder,
  onCreateNote,
  onToggle
}) => {
  if (!show) return null;

  const handleCreateFolder = () => {
    onCreateFolder(newFolderName);
    setNewFolderName('');
    onToggle(false);
  };

  const handleCreateNote = () => {
    onCreateNote(newNoteName);
    setNewNoteName('');
    onToggle(false);
  };

  return (
    <div className="creation-panel">
      <div className="input-group">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Folder name"
          className="creation-input"
        />
        <button onClick={handleCreateFolder} className="icon-button" title="Create Folder">
          <FaFolderPlus />
        </button>
      </div>
      
      <div className="input-group">
        <input
          type="text"
          value={newNoteName}
          onChange={(e) => setNewNoteName(e.target.value)}
          placeholder="Note name"
          className="creation-input"
        />
        <button onClick={handleCreateNote} className="icon-button" title="Create Note">
          <FaFileAlt />
        </button>
      </div>
    </div>
  );
};

export default CreationPanel;
