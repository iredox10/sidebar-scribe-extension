import { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft, FaCheck, FaInfoCircle, FaFolder } from 'react-icons/fa';
import '../App.css';
import './SettingsPage.css';

const SettingsPage = ({ folders = [], defaultFolder, theme, onSaveSettings, onBack }) => {
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder || '');
  const [selectedTheme, setSelectedTheme] = useState(theme || 'light');
  const [localSavePath, setLocalSavePath] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);
  const [dateFormat, setDateFormat] = useState('short');
  const [defaultFileFormat, setDefaultFileFormat] = useState('md');
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  
  // GitHub Settings
  const [githubToken, setGithubToken] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubAutoSync, setGithubAutoSync] = useState(false);
  const [githubSyncMode, setGithubSyncMode] = useState('json');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

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
          'showLineNumbers',
          'githubToken',
          'githubRepo',
          'githubBranch',
          'githubAutoSync',
          'githubSyncMode'
        ]);
        
        setSelectedFolder(result.defaultFolder || defaultFolder || '');
        setSelectedTheme(result.theme || theme || 'light');
        setLocalSavePath(result.localSavePath || '');
        setAutoSave(result.autoSave !== undefined ? result.autoSave : true);
        setAutoSaveInterval(result.autoSaveInterval || 30);
        setDateFormat(result.dateFormat || 'short');
        setDefaultFileFormat(result.defaultFileFormat || 'md');
        setShowLineNumbers(result.showLineNumbers || false);
        
        // GitHub Load
        setGithubToken(result.githubToken || '');
        setGithubRepo(result.githubRepo || '');
        setGithubBranch(result.githubBranch || 'main');
        setGithubAutoSync(result.githubAutoSync || false);
        setGithubSyncMode(result.githubSyncMode || 'json');
        
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
      showLineNumbers: showLineNumbers,
      // GitHub Save
      githubToken: githubToken,
      githubRepo: githubRepo,
      githubBranch: githubBranch,
      githubAutoSync: githubAutoSync,
      githubSyncMode: githubSyncMode
    };
    
    // Save to chrome storage
    try {
      await chrome.storage.local.set(settings);
      console.log('✅ Settings saved:', settings);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      
      onSaveSettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleSelectSavePath = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const directoryHandle = await window.showDirectoryPicker({
          mode: 'readwrite',
          startIn: 'documents'
        });
        const dirName = directoryHandle.name;
        setLocalSavePath(dirName);
        await chrome.storage.local.set({ 
          localSaveDirectoryName: dirName,
          localSavePath: dirName
        });
        alert(`Directory selected: ${dirName}`);
      } else {
        const path = prompt('Enter the reference path for your notes:', localSavePath || 'Documents/Notes');
        if (path) setLocalSavePath(path);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error selecting save path:', error);
      }
    }
  };

  return (
    <div className={`settings-page theme-${selectedTheme}`}>
      <div className="settings-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h2>Settings</h2>
        </div>
        <button 
          className={`save-action-btn ${saveSuccess ? 'success' : ''}`} 
          onClick={handleSave}
        >
          {saveSuccess ? <FaCheck /> : <FaSave />}
          <span>{saveSuccess ? 'Saved' : 'Save Changes'}</span>
        </button>
      </div>
      
      <div className="settings-container">
        {/* General Section */}
        <div className="settings-section">
          <div className="section-title">General</div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="theme-selector">Appearance</label>
              <p className="setting-desc">Choose your preferred visual theme</p>
            </div>
            <div className="setting-control">
              <select 
                id="theme-selector"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="select-input"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="default-folder">Default Location</label>
              <p className="setting-desc">New notes will be created here</p>
            </div>
            <div className="setting-control">
              <select 
                id="default-folder"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="select-input"
              >
                <option value="">Root (No Folder)</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="settings-section">
          <div className="section-title">Editor & Saving</div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Auto-Save</label>
              <p className="setting-desc">Save changes automatically while typing</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {autoSave && (
            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="auto-save-interval">Save Interval</label>
                <p className="setting-desc">Seconds between auto-saves</p>
              </div>
              <div className="setting-control">
                <input
                  type="number"
                  id="auto-save-interval"
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(parseInt(e.target.value) || 30)}
                  min="5"
                  max="300"
                  className="number-input"
                />
              </div>
            </div>
          )}

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="file-format">Export Format</label>
              <p className="setting-desc">Default extension for saved files</p>
            </div>
            <div className="setting-control">
              <select 
                id="file-format"
                value={defaultFileFormat}
                onChange={(e) => setDefaultFileFormat(e.target.value)}
                className="select-input"
              >
                <option value="md">Markdown (.md)</option>
                <option value="txt">Plain Text (.txt)</option>
                <option value="html">HTML (.html)</option>
              </select>
            </div>
          </div>
        </div>

        {/* GitHub Sync Section */}
        <div className="settings-section">
          <div className="section-title">GitHub Sync</div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Auto-Push</label>
              <p className="setting-desc">Automatically push changes to GitHub</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={githubAutoSync}
                  onChange={(e) => setGithubAutoSync(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="github-token">Personal Access Token</label>
              <p className="setting-desc">Token with 'repo' scope</p>
            </div>
            <div className="setting-control">
              <input
                type="password"
                id="github-token"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className="select-input"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="github-repo">Repository</label>
              <p className="setting-desc">username/repo-name</p>
            </div>
            <div className="setting-control">
              <input
                type="text"
                id="github-repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="username/repo"
                className="select-input"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="github-branch">Branch</label>
              <p className="setting-desc">Branch to push to</p>
            </div>
            <div className="setting-control">
              <input
                type="text"
                id="github-branch"
                value={githubBranch}
                onChange={(e) => setGithubBranch(e.target.value)}
                placeholder="main"
                className="select-input"
              />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="github-mode">Sync Mode</label>
              <p className="setting-desc">How to structure files in the repo</p>
            </div>
            <div className="setting-control">
              <select 
                id="github-mode"
                value={githubSyncMode}
                onChange={(e) => setGithubSyncMode(e.target.value)}
                className="select-input"
              >
                <option value="json">Single Backup File (JSON)</option>
                <option value="markdown">Individual Files (Markdown)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Section */}
        <div className="settings-section">
          <div className="section-title">Data Management</div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Local Directory</label>
              <p className="setting-desc">
                {localSavePath ? `Selected: ${localSavePath}` : 'No directory selected'}
              </p>
            </div>
            <div className="setting-control">
              <button 
                className="secondary-btn" 
                onClick={handleSelectSavePath}
              >
                <FaFolder /> Browse
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <p><FaInfoCircle /> Sidebar Note v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
