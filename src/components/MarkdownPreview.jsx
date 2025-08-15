// src/components/MarkdownPreview.jsx
import React from 'react';

const MarkdownPreview = ({ content }) => {
  // Simple markdown parser (in a real app, you'd use a library like marked.js)
  const marked = (content) => {
    if (!content) return '';
    
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div 
      className="markdown-preview"
      dangerouslySetInnerHTML={{ 
        __html: marked(content || '') 
      }}
    />
  );
};

export default MarkdownPreview;