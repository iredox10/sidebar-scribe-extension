import React from 'react';
import { FaFileAlt, FaFolderOpen } from 'react-icons/fa';

const WelcomeMessage = ({ 
  onCreateNote, 
  onLoadFromFile 
}) => {
  return (
    <div className="no-note-selected">
      <div className="welcome-message">
        <h2>New Note</h2>
        <p>Start writing your note below</p>
        <div className="quick-actions">
          <button 
            className="welcome-btn" 
            onClick={onCreateNote}
          >
            <FaFileAlt /> Create Note with Timestamp
          </button>
          <button 
            className="welcome-btn" 
            onClick={onLoadFromFile}
          >
            <FaFolderOpen /> Load from File
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
