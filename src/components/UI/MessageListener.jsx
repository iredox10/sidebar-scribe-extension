import React, { useEffect } from 'react';

const MessageListener = ({ 
  onCreateNoteFromSelection,
  onAppendToCurrentNote,
  currentNote,
  defaultFolderId 
}) => {
  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "createNoteFromSelection") {
        const { text } = message;
        
        // Always create a new note
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        const noteName = `Selection - ${dateStr}`;
        
        const newNote = {
          id: Date.now().toString(),
          name: noteName,
          content: text,
          folderId: defaultFolderId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onCreateNoteFromSelection(newNote);
      } else if (message.action === "appendToCurrentNote") {
        const { text, metadata } = message;
        
        console.log("📝 Append to current note action triggered");
        console.log("Current note:", currentNote);
        console.log("Text to append:", text);
        console.log("Metadata:", metadata);
        
        // Append to current note if one is selected
        if (currentNote && onAppendToCurrentNote) {
          console.log("✅ Appending to current note:", currentNote.name);
          onAppendToCurrentNote(text, metadata);
        } else {
          // If no note is selected, show a notification or create a new note
          console.log("⚠️ No note selected. Creating a new note instead.");
          // Optionally, you could create a new note instead
          const now = new Date();
          const dateStr = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          const noteName = `Selection - ${dateStr}`;
          
          const newNote = {
            id: Date.now().toString(),
            name: noteName,
            content: text,
            folderId: defaultFolderId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          onCreateNoteFromSelection(newNote);
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [defaultFolderId, currentNote, onCreateNoteFromSelection, onAppendToCurrentNote]);

  return null; // This component doesn't render anything
};

export default MessageListener;
