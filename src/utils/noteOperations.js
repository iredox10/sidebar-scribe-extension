// src/utils/noteOperations.js

export const createFolder = (folders, folderName) => {
  if (!folderName.trim()) return folders;
  
  const newFolder = {
    id: Date.now().toString(),
    name: folderName.trim(),
    createdAt: new Date().toISOString()
  };
  
  return [...folders, newFolder];
};

export const createNote = (notes, noteName, folderId = null) => {
  if (!noteName.trim()) return notes;
  
  const newNote = {
    id: Date.now().toString(),
    name: noteName.trim(),
    content: '',
    folderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return [...notes, newNote];
};

export const deleteFolder = (folders, notes, folderId) => {
  // Delete the folder
  const updatedFolders = folders.filter(folder => folder.id !== folderId);
  
  // Delete all notes in the folder
  const updatedNotes = notes.filter(note => note.folderId !== folderId);
  
  return {
    folders: updatedFolders,
    notes: updatedNotes
  };
};

export const deleteNote = (notes, noteId) => {
  return notes.filter(note => note.id !== noteId);
};

export const updateNoteContent = (notes, noteId, content) => {
  return notes.map(note => {
    if (note.id === noteId) {
      return {
        ...note,
        content,
        updatedAt: new Date().toISOString()
      };
    }
    return note;
  });
};

export const getNotesByFolder = (notes, folderId) => {
  return notes.filter(note => note.folderId === folderId);
};

export const getRootNotes = (notes) => {
  return notes.filter(note => !note.folderId);
};

export const findNoteById = (notes, noteId) => {
  return notes.find(note => note.id === noteId) || null;
};

// Simple HTML to Markdown converter
export const htmlToMarkdown = (html) => {
  if (!html) return '';
  
  let markdown = html;

  // Remove style blocks
  markdown = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  markdown = markdown.replace(/<\/div>/gi, '\n');
  markdown = markdown.replace(/<\/p>/gi, '\n\n');
  
  // Headers
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

  // Bold/Italic
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Links
  markdown = markdown.replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Lists
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<ol[^>]*>/gi, '\n');
  markdown = markdown.replace(/<\/ol>/gi, '\n');

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');

  // Code
  markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Strip remaining tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Fix multiple newlines
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Decode entities
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&quot;/g, '"');

  return markdown.trim();
};