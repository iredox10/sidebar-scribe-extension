import React, { useEffect } from 'react';

const MessageListener = ({ 
  onCreateNoteFromSelection, 
  defaultFolderId 
}) => {
  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "createNoteFromSelection") {
        const { text } = message;
        const timestamp = new Date().toLocaleString();
        const noteName = `Note from selection - ${timestamp}`;
        
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
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [defaultFolderId, onCreateNoteFromSelection]);

  return null; // This component doesn't render anything
};

export default MessageListener;
