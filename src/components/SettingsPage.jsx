import { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft, FaMoon, FaSun, FaFolder, FaDesktop, FaFileAlt, FaClock, FaDownload } from 'react-icons/fa';
import '../App.css';

const SettingsPage = ({ folders = [], defaultFolder, theme, onSaveSettings, onBack }) => {
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder || '');
  const [selectedTheme, setSelectedTheme] = useState(theme || 'light');
  const [localSavePath, setLocalSavePath] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);
  const [dateFormat, setDateFormat] = useState('short');
  const [defaultFileFormat, setDefaultFileFormat] = useState('md');
  const [showLineNumbers, setShowLineNumbers] = useState(false);

  useEffect(() => {
    // Load settings from storage
    const loadSettings = async () => {
      try {
        const result = await chrome.storage.local.get([
          'defaultFolder',
          'theme',
          'localSavePath',
          'autoSave',
          'autoSaveInterval',
          'dateFormat',
          'defaultFileFormat',
          'showLineNumbers'
        ]);
        
        setSelectedFolder(result.defaultFolder || defaultFolder || '');
        setSelectedTheme(result.theme || theme || 'light');
        setLocalSavePath(result.localSavePath || '');
        setAutoSave(result.autoSave !== undefined ? result.autoSave : true);
        setAutoSaveInterval(result.autoSaveInterval || 30);
        setDateFormat(result.dateFormat || 'short');
        setDefaultFileFormat(result.defaultFileFormat || 'md');
        setShowLineNumbers(result.showLineNumbers || false);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, [defaultFolder, theme]);

  const handleSave = async () => {
    const settings = { 
      defaultFolder: selectedFolder,
      theme: selectedTheme,
      localSavePath: localSavePath,
      autoSave: autoSave,
      autoSaveInterval: autoSaveInterval,
      dateFormat: dateFormat,
      defaultFileFormat: defaultFileFormat,
      showLineNumbers: showLineNumbers
    };
    
    // Save to chrome storage
    try {
      await chrome.storage.local.set(settings);
      console.log('✅ Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    
    onSaveSettings(settings);
  };

  const handleSelectSavePath = async () => {
    try {
      // Use the File System Access API (only works in modern browsers)
      if ('showDirectoryPicker' in window) {
        const directoryHandle = await window.showDirectoryPicker({
          mode: 'readwrite',
          startIn: 'documents'
        });
        
        // Store the directory handle name/path
        const dirName = directoryHandle.name;
        setLocalSavePath(dirName);
        
        // Store the directory handle for later use
        // Note: We can't directly serialize the handle, so we store the name
        // The actual handle would need to be requested again when saving
        await chrome.storage.local.set({ 
          localSaveDirectoryName: dirName,
          localSavePath: dirName
        });
        
        alert(`Directory selected: ${dirName}\n\nNote: You'll need to grant permission again when saving files.`);
      } else {
        // Fallback for browsers that don't support File System Access API
        alert('Your browser does not support directory selection.\n\nPlease manually enter the path where you want to save notes (e.g., Documents/Notes).\n\nNote: This path is for reference only. Files will still be saved to your Downloads folder.');
        const path = prompt('Enter the reference path for your notes:', localSavePath || 'Documents/Notes');
        if (path) {
          setLocalSavePath(path);
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Directory selection cancelled');
      } else {
        console.error('Error selecting save path:', error);
        alert('Failed to select directory. Please try again.');
      }
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
        {/* Default Folder */}
        <div className="setting-group">
          <label htmlFor="default-folder">
            <FaFolder /> Default Folder for New Notes
          </label>
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
        
        {/* Theme */}
        <div className="setting-group">
          <label htmlFor="theme-selector">
            {selectedTheme === 'dark' ? <FaMoon /> : <FaSun />} Theme
          </label>
          <select 
            id="theme-selector"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="theme-select"
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
          <p className="setting-description">
            Choose between light and dark theme for the application.
          </p>
        </div>
        
        {/* Local Save Path */}
        <div className="setting-group">
          <label htmlFor="local-save-path">
            <FaDownload /> Local Save Directory
          </label>
          <div className="path-selector">
            <input
              type="text"
              id="local-save-path"
              value={localSavePath}
              onChange={(e) => setLocalSavePath(e.target.value)}
              placeholder="Click 'Browse' to select a directory"
              className="folder-select"
              readOnly
            />
            <button 
              className="select-path-btn" 
              onClick={handleSelectSavePath}
              title="Browse for directory"
            >
              <FaFolder /> Browse
            </button>
          </div>
          <p className="setting-description">
            Click "Browse" to select the directory where notes will be saved when exported. You'll need to grant permission each time you save.
          </p>
        </div>
        
        {/* Default File Format */}
        <div className="setting-group">
          <label htmlFor="file-format">
            <FaFileAlt /> Default Export Format
          </label>
          <select 
            id="file-format"
            value={defaultFileFormat}
            onChange={(e) => setDefaultFileFormat(e.target.value)}
            className="theme-select"
          >
            <option value="md">📝 Markdown (.md)</option>
            <option value="txt">📄 Plain Text (.txt)</option>
            <option value="html">🌐 HTML (.html)</option>
          </select>
          <p className="setting-description">
            Choose the default file format when saving notes locally.
          </p>
        </div>
        
        {/* Auto Save */}
        <div className="setting-group">
          <label htmlFor="auto-save">
            <FaClock /> Auto Save
          </label>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="auto-save"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
            />
            <label htmlFor="auto-save">Enable auto-save</label>
          </div>
          <p className="setting-description">
            Automatically save changes as you type.
          </p>
        </div>
        
        {/* Auto Save Interval */}
        {autoSave && (
          <div className="setting-group">
            <label htmlFor="auto-save-interval">
              <FaClock /> Auto Save Interval (seconds)
            </label>
            <input
              type="number"
              id="auto-save-interval"
              value={autoSaveInterval}
              onChange={(e) => setAutoSaveInterval(parseInt(e.target.value) || 30)}
              min="5"
              max="300"
              className="folder-select"
            />
            <p className="setting-description">
              How often to automatically save changes (5-300 seconds).
            </p>
          </div>
        )}
        
        {/* Date Format */}
        <div className="setting-group">
          <label htmlFor="date-format">
            <FaClock /> Date Format
          </label>
          <select 
            id="date-format"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="theme-select"
          >
            <option value="short">Short (Jan 1, 2025)</option>
            <option value="long">Long (January 1, 2025)</option>
            <option value="iso">ISO (2025-01-01)</option>
            <option value="full">Full (Monday, January 1, 2025)</option>
          </select>
          <p className="setting-description">
            Choose how dates are displayed in note names and timestamps.
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