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
  const prevNoteIdRef = useRef(null);
  
  // Only force re-render when switching to a different note, not on content changes
  useEffect(() => {
    if (selectedNote && selectedNote.id !== prevNoteIdRef.current) {
      console.log("📝 Switched to different note, forcing editor re-render");
      setEditorKey(prev => prev + 1);
      prevNoteIdRef.current = selectedNote.id;
    }
  }, [selectedNote]);
  
  const editorOptions = {
    height: '80vh',
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
    placeholder: 'Start writing your note...',
    toolbarWidth: 'auto',
    stickyToolbar: false,
    hideToolbar: false,
    defaultStyle: `
      font-family: Arial, Helvetica, sans-serif; 
      font-size: 14px; 
      line-height: 1.5;
      background-color: ${isDark ? '#2a2a2a' : '#ffffff'};
      color: ${isDark ? '#e0e0e0' : '#333333'};
    `,
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
