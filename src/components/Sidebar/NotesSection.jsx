import React from 'react';
import { FaStar } from 'react-icons/fa';
import NoteItem from './NoteItem';

const NotesSection = ({
  title,
  notes,
  selectedNote,
  favorites,
  onSelectNote,
  onToggleFavorite,
  onDeleteNote,
  onStartEditNote,
  editingNoteId,
  editingNoteName,
  onEditingNoteNameChange,
  onSaveNoteEdit,
  icon = null
}) => {
  if (notes.length === 0) return null;

  return (
    <div className="explorer-section">
      <h3>{icon && <span className="section-icon">{icon}</span>} {title}</h3>
      <ul className="notes-list">
        {notes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            isSelected={selectedNote && selectedNote.id === note.id}
            isFavorite={favorites.has(note.id)}
            onSelect={onSelectNote}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDeleteNote}
            onStartEdit={onStartEditNote}
            isEditing={editingNoteId === note.id}
            editingName={editingNoteName}
            onEditingNameChange={onEditingNoteNameChange}
            onSaveEdit={onSaveNoteEdit}
          />
        ))}
      </ul>
    </div>
  );
};

export default NotesSection;
