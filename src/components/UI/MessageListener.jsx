import React, { useEffect, useRef } from 'react';

const MessageListener = ({ 
  onCreateNoteFromSelection,
  onAppendToCurrentNote,
  currentNote,
  defaultFolderId 
}) => {
  // Track processed message IDs to prevent duplicates
  const processedMessageIds = useRef(new Set());

  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      // 1. Acknowledge receipt immediately to prevent Service Worker from retrying
      // This is crucial! If we don't send a response, the SW might think the delivery failed.
      sendResponse({ received: true });

      // 2. Deduplication check
      if (message.messageId && processedMessageIds.current.has(message.messageId)) {
        console.log(`🚫 Duplicate message ignored: ${message.messageId}`);
        return false;
      }
      
      if (message.messageId) {
        processedMessageIds.current.add(message.messageId);
        // Optional: clean up old IDs to prevent memory leak (though unlikely to be an issue)
        if (processedMessageIds.current.size > 100) {
          const it = processedMessageIds.current.values();
          processedMessageIds.current.delete(it.next().value);
        }
      }

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
