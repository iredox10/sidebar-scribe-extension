import React, { useRef, useEffect } from 'react';
import TiptapEditor from './TiptapEditor';
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
  theme = 'light',
  enabledTools = []
}) => {
  const [editorKey, setEditorKey] = React.useState(0);
  const prevNoteIdRef = useRef(null);
  
  // Force re-render when switching to a different note
  useEffect(() => {
    if (selectedNote && selectedNote.id !== prevNoteIdRef.current) {
      console.log("📝 Switched to different note, forcing editor re-render");
      setEditorKey(prev => prev + 1);
      prevNoteIdRef.current = selectedNote.id;
    }
  }, [selectedNote]);

  return (
    <div className={`editor-container ${theme === 'dark' ? 'editor-dark' : ''}`}>
      {selectedNote ? (
        <div className="editor-wrapper">
          <EditorHeader
            selectedNote={selectedNote}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSaveToFile={onSaveToFile}
          />
          <TiptapEditor
            key={`${selectedNote.id}-${theme}-${editorKey}`}
            content={noteContent}
            onChange={onUpdateContent}
            theme={theme}
            enabledTools={enabledTools}
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