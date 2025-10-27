import { Node } from '@tiptap/core';

export const CustomButton = Node.create({
  name: 'customButton',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      class: {
        default: null,
      },
      type: {
        default: 'button',
      },
      style: {
        default: null,
      },
      title: {
        default: null,
      },
      'data-target': {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'button',
        priority: 51,
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['button', HTMLAttributes, node.attrs.text || 'ⓘ'];
  },

  addNodeView() {
    return ({ node }) => {
      const button = document.createElement('button');
      button.type = node.attrs.type || 'button';
      button.className = node.attrs.class || '';
      button.style.cssText = node.attrs.style || '';
      button.title = node.attrs.title || '';
      if (node.attrs['data-target']) {
        button.setAttribute('data-target', node.attrs['data-target']);
      }
      button.textContent = 'ⓘ';
      
      return {
        dom: button,
      };
    };
  },
});
