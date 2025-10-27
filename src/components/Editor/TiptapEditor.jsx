import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomDiv } from './CustomDiv';
import { CustomButton } from './CustomButton';
import './TiptapEditor.css';

const TiptapEditor = ({ content, onChange, theme = 'light' }) => {
  const editorContainerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Allow more HTML attributes to pass through
        HTMLAttributes: {
          preserveWhitespace: 'full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
      CustomDiv,
      CustomButton,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor ${theme === 'dark' ? 'tiptap-dark' : ''}`,
      },
    },
    // Enable HTML parsing
    parseOptions: {
      preserveWhitespace: 'full',
    },
  });

  // Update editor content when prop changes (for append functionality)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // Add event listeners for metadata toggle links
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const handleToggleClick = (e) => {
      // Only handle if the clicked element has the metadata-toggle-link class
      // or if we clicked on the text inside it
      let target = e.target;
      
      // Check if it's the span itself or inside the span
      if (target.classList && target.classList.contains('metadata-toggle-link')) {
        // It's the span
      } else if (target.parentElement && target.parentElement.classList && 
                 target.parentElement.classList.contains('metadata-toggle-link')) {
        // Clicked on text inside the span
        target = target.parentElement;
      } else {
        // Not our element
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();

      console.log('🔗 Toggle link clicked');
      
      const metadataId = target.getAttribute('data-target');
      console.log('🔍 Looking for metadata ID:', metadataId);
      
      if (!metadataId) {
        console.log('❌ No data-target attribute found');
        return;
      }

      // Find the metadata div
      const infoDiv = editorContainerRef.current.querySelector(`#${metadataId}`);
      console.log('📦 Found info div:', infoDiv);
      
      if (!infoDiv) {
        console.log('❌ Could not find info div with ID:', metadataId);
        return;
      }

      const isHidden = infoDiv.style.display === 'none' || infoDiv.style.display === '';
      infoDiv.style.display = isHidden ? 'block' : 'none';
      
      // Update the link text
      target.textContent = isHidden ? '✕ Hide source' : '🔗 View source';
      
      console.log('✅ Toggled metadata visibility:', isHidden ? 'shown' : 'hidden');
    };

    const container = editorContainerRef.current;
    
    // Add both click and mousedown listeners to catch the event before Tiptap
    container.addEventListener('mousedown', handleToggleClick, true);
    container.addEventListener('click', handleToggleClick, true);

    return () => {
      container.removeEventListener('mousedown', handleToggleClick, true);
      container.removeEventListener('click', handleToggleClick, true);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`tiptap-wrapper ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="tiptap-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <div className="toolbar-divider"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          title="Heading 3"
        >
          H3
        </button>
        <div className="toolbar-divider"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="toolbar-divider"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Blockquote"
        >
          " Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="Code Block"
        >
          {'</>'}
        </button>
        <div className="toolbar-divider"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          ―
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          ↷
        </button>
      </div>
      <div ref={editorContainerRef}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
