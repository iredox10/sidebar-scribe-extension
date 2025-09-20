import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MessageListener = ({ 
  onCreateNoteFromSelection, 
  defaultFolderId 
}) => {
  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "createNoteFromSelection") {
        const { text } = message;
        const noteName = `Selection - ${uuidv4().slice(0, 8)}`;
        
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
