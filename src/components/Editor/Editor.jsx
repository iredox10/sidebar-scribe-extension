import React from 'react';
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
  onLoadFromFile
}) => {
  const editorOptions = {
    height: '100%',
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
    maxHeight: '100%',
    minHeight: '200px',
    placeholder: 'Start writing your note...',
    // Make toolbar more compact
    toolbarWidth: 'auto',
    stickyToolbar: false,
    hideToolbar: false,
    // Reduce toolbar padding and margins
    defaultStyle: 'font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5;'
  };

  return (
    <div className="editor-container">
      {selectedNote ? (
        <div className="editor-wrapper">
          <EditorHeader
            selectedNote={selectedNote}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSaveToFile={onSaveToFile}
          />
          <SunEditor
            key={selectedNote.id}
            defaultValue={noteContent}
            onChange={onUpdateContent}
            setOptions={editorOptions}
          />
        </div>
      ) : (
        <>
          <WelcomeMessage
            onCreateNote={onQuickCreateNote}
            onLoadFromFile={onLoadFromFile}
          />
          <SunEditor
            key="new-note"
            defaultValue=""
            onChange={onUpdateContent}
            setOptions={editorOptions}
          />
        </>
      )}
    </div>
  );
};

export default Editor;
