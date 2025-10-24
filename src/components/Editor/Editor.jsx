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
  const prevContentLengthRef = useRef(0);
  const isUserTypingRef = useRef(false);
  
  // Detect when content changes externally (e.g., from append) vs user typing
  useEffect(() => {
    const noteChanged = selectedNote && selectedNote.id !== prevNoteIdRef.current;
    
    if (noteChanged) {
      console.log("📝 Switched to different note, forcing editor re-render");
      setEditorKey(prev => prev + 1);
      prevNoteIdRef.current = selectedNote.id;
      prevContentLengthRef.current = noteContent.length;
      isUserTypingRef.current = false;
    } else if (!isUserTypingRef.current && noteContent.length !== prevContentLengthRef.current) {
      // Content changed but not from user typing - must be external (append)
      console.log("📝 External content change detected (append), re-rendering editor");
      setEditorKey(prev => prev + 1);
      prevContentLengthRef.current = noteContent.length;
    }
  }, [selectedNote, noteContent]);
  
  // Wrap onChange to track user typing
  const handleChange = (content) => {
    isUserTypingRef.current = true;
    prevContentLengthRef.current = content.length;
    onUpdateContent(content);
    // Reset flag after a short delay
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 100);
  };
  
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
            onChange={handleChange}
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
