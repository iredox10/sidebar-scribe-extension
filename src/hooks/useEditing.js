import { useState } from 'react';

export const useEditing = () => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteName, setEditingNoteName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  const startEditingNoteName = (noteId, currentName) => {
    setEditingNoteId(noteId);
    setEditingNoteName(currentName);
  };

  const startEditingFolderName = (folderId, currentName) => {
    setEditingFolderId(folderId);
    setEditingFolderName(currentName);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingNoteName('');
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  return {
    editingNoteId,
    editingNoteName,
    setEditingNoteName,
    editingFolderId,
    editingFolderName,
    setEditingFolderName,
    startEditingNoteName,
    startEditingFolderName,
    cancelEditing
  };
};
