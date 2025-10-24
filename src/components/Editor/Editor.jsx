import React, { useRef, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import EditorHeader from './EditorHeader';
import WelcomeMessage from './WelcomeMessage';

const Editor = ({
  selectedNote,
  noteContent,
  onUpdateContent,
  favorites,
  onToggleFavorite,
  onSaveToFile,
  onQuickCreateNote,
  onLoadFromFile,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const editorRef = useRef(null);
  const [editorKey, setEditorKey] = React.useState(0);
  
  // Force re-render when noteContent changes externally
  useEffect(() => {
    if (selectedNote) {
      console.log("📝 Note content changed, forcing editor re-render");
      setEditorKey(prev => prev + 1);
    }
  }, [noteContent, selectedNote]);
  
  const editorOptions = {
    height: 'auto',
    width: '100%',
    mode: 'classic',
    font: 'Arial, Helvetica, sans-serif',
    fontSize: 14,
    buttonList: [
      ['bold', 'italic', 'underline', 'strike'],
      ['fontColor', 'hiliteColor', 'removeFormat'],
      ['list', 'align'],
      ['link', 'codeView']
    ],
    resizingBar: false,
    charCounter: false,
    showPathLabel: false,
    maxHeight: 'none',
    minHeight: '300px',
    placeholder: 'Start writing your note...',
    // Make toolbar more compact
    toolbarWidth: 'auto',
    stickyToolbar: false,
    hideToolbar: false,
    // Enable scrolling
    overflow: 'auto',
    // Apply theme-aware styling
    defaultStyle: `
      font-family: Arial, Helvetica, sans-serif; 
      font-size: 14px; 
      line-height: 1.5;
      background-color: ${isDark ? '#2a2a2a' : '#ffffff'};
      color: ${isDark ? '#e0e0e0' : '#333333'};
    `,
    // Override SunEditor's internal styles for dark theme
    className: isDark ? 'sun-editor-dark' : ''
  };

  return (
    <div className={`editor-container ${isDark ? 'editor-dark' : ''}`}>
      {selectedNote ? (
        <div className="editor-wrapper">
          <EditorHeader
            selectedNote={selectedNote}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSaveToFile={onSaveToFile}
          />
          <SunEditor
            ref={editorRef}
            key={`${selectedNote.id}-${theme}-${editorKey}`}
            defaultValue={noteContent}
            onChange={onUpdateContent}
            setOptions={editorOptions}
          />
        </div>
      ) : (
        <WelcomeMessage
          onCreateNote={onQuickCreateNote}
          onLoadFromFile={onLoadFromFile}
        />
      )}
    </div>
  );
};

export default Editor;
