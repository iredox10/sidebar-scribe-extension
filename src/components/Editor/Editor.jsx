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
    fontSize: 16,
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'table'],
      ['link', 'image', 'video'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['print'],
    ],
    resizingBar: false,
    charCounter: true,
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
