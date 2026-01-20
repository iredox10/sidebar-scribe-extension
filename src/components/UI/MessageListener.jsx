import React, { useEffect } from 'react';

const MessageListener = ({ 
  onCreateNoteFromSelection,
  onAppendToCurrentNote,
  currentNote,
  defaultFolderId 
}) => {
  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      // Helper to format content with source
      const formatContent = (text, sourceUrl, sourceTitle) => {
        let content = text;
        // Convert newlines to breaks for HTML compatibility if needed, 
        // but text usually comes as plain text. 
        // We'll trust the editor to handle the main text, but ensure Source is HTML.
        
        if (sourceUrl) {
          // Use HTML for the source link to ensure it renders correctly in SunEditor
          content += `<br><br><strong>Source:</strong> <a href="${sourceUrl}" target="_blank">${sourceTitle || 'Link'}</a>`;
        }
        return content;
      };

      if (message.action === "createNoteFromSelection") {
        const { text, sourceUrl, sourceTitle } = message;
        const formattedContent = formatContent(text, sourceUrl, sourceTitle);
        
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
          content: formattedContent,
          folderId: defaultFolderId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onCreateNoteFromSelection(newNote);
      } else if (message.action === "appendToCurrentNote") {
        const { text, sourceUrl, sourceTitle } = message;
        const formattedContent = formatContent(text, sourceUrl, sourceTitle);
        
        console.log("📝 Append to current note action triggered");
        console.log("Current note:", currentNote);
        console.log("Text to append:", formattedContent);
        
        // Append to current note if one is selected
        if (currentNote && onAppendToCurrentNote) {
          console.log("✅ Appending to current note:", currentNote.name);
          onAppendToCurrentNote(formattedContent);
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
            content: formattedContent,
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
