import { Node, mergeAttributes } from '@tiptap/core';

export const MetadataContainer = Node.create({
  name: 'metadataContainer',

  group: 'block',

  content: 'block+',

  atom: false,

  selectable: true,

  draggable: true,

  addAttributes() {
    return {
      class: {
        default: null,
      },
      'data-metadata-id': {
        default: null,
      },
      style: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.metadata-container',
        priority: 100,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { contenteditable: 'false' }), 0];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.classList.add('metadata-container');
      if (node.attrs.class) {
        node.attrs.class.split(' ').forEach(cls => dom.classList.add(cls));
      }
      if (node.attrs['data-metadata-id']) {
        dom.setAttribute('data-metadata-id', node.attrs['data-metadata-id']);
      }
      if (node.attrs.style) {
        dom.setAttribute('style', node.attrs.style);
      }
      dom.setAttribute('contenteditable', 'false');

      const contentDOM = document.createElement('div');
      contentDOM.setAttribute('contenteditable', 'true');
      contentDOM.classList.add('metadata-editable-content');
      
      dom.appendChild(contentDOM);

      return {
        dom,
        contentDOM,
        ignoreMutation: (mutation) => {
          // Ignore all mutations except those in the content area
          return !contentDOM.contains(mutation.target) && mutation.target !== contentDOM;
        },
      };
    };
  },
});
