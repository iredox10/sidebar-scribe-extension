import { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import '../App.css';

const SettingsPage = ({ folders, defaultFolder, onSaveSettings, onBack }) => {
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder || '');

  useEffect(() => {
    setSelectedFolder(defaultFolder || '');
  }, [defaultFolder]);

  const handleSave = () => {
    onSaveSettings({ defaultFolder: selectedFolder });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
        <h2>Settings</h2>
      </div>
      
      <div className="settings-content">
        <div className="setting-group">
          <label htmlFor="default-folder">Default Folder for New Notes</label>
          <select 
            id="default-folder"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="folder-select"
          >
            <option value="">Root (No Folder)</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <p className="setting-description">
            Notes created from the browser toolbar will be saved to this folder by default.
          </p>
        </div>
        
        <button className="save-settings-btn" onClick={handleSave}>
          <FaSave /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;