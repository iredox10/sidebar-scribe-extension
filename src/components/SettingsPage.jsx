import { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft, FaMoon, FaSun, FaFolder, FaDesktop } from 'react-icons/fa';
import '../App.css';

const SettingsPage = ({ folders = [], defaultFolder, theme, onSaveSettings, onBack }) => {
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder || '');
  const [selectedTheme, setSelectedTheme] = useState(theme || 'light');
  const [localSavePath, setLocalSavePath] = useState('');
  const [showPathSelector, setShowPathSelector] = useState(false);

  useEffect(() => {
    setSelectedFolder(defaultFolder || '');
    setSelectedTheme(theme || 'light');
  }, [defaultFolder, theme]);

  const handleSave = () => {
    onSaveSettings({ 
      defaultFolder: selectedFolder,
      theme: selectedTheme,
      localSavePath: localSavePath
    });
  };

  const handleSelectSavePath = async () => {
    try {
      // In a real Chrome extension, you would use the chrome.fileSystem API
      // For now, we'll just prompt the user for a path
      const path = prompt('Enter the path where you want to save your notes:', localSavePath || '~/Documents/Notes');
      if (path) {
        setLocalSavePath(path);
      }
    } catch (error) {
      console.error('Error selecting save path:', error);
      alert('Error selecting save path. Please try again.');
    }
  };

  return (
    <div className={`settings-page theme-${selectedTheme}`}>
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
        
        <div className="setting-group">
          <label htmlFor="theme-selector">Theme</label>
          <select 
            id="theme-selector"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="theme-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <p className="setting-description">
            Choose between light and dark theme for the application.
          </p>
        </div>
        
        <div className="setting-group">
          <label htmlFor="local-save-path">Local Save Path</label>
          <div className="path-selector">
            <input
              type="text"
              id="local-save-path"
              value={localSavePath}
              onChange={(e) => setLocalSavePath(e.target.value)}
              placeholder="Enter path for local saves (e.g., ~/Documents/Notes)"
              className="folder-select"
            />
            <button 
              className="select-path-btn" 
              onClick={handleSelectSavePath}
              title="Select Save Path"
            >
              <FaFolder />
            </button>
          </div>
          <p className="setting-description">
            Specify the default path where notes will be saved locally. Leave empty to use downloads folder.
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