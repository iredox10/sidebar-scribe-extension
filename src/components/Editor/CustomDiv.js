import { Node } from '@tiptap/core';

export const CustomDiv = Node.create({
  name: 'customDiv',

  group: 'block',

  content: 'block*',

  defining: true,

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {};
          }
          return { class: attributes.class };
        },
      },
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return { id: attributes.id };
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
      contenteditable: {
        default: null,
        parseHTML: element => element.getAttribute('contenteditable'),
        renderHTML: attributes => {
          if (!attributes.contenteditable) {
            return {};
          }
          return { contenteditable: attributes.contenteditable };
        },
      },
      // Data attributes for metadata
      'data-metadata-id': {
        default: null,
        parseHTML: element => element.getAttribute('data-metadata-id'),
        renderHTML: attributes => {
          if (!attributes['data-metadata-id']) {
            return {};
          }
          return { 'data-metadata-id': attributes['data-metadata-id'] };
        },
      },
      'data-timestamp': {
        default: null,
        parseHTML: element => element.getAttribute('data-timestamp'),
        renderHTML: attributes => {
          if (!attributes['data-timestamp']) {
            return {};
          }
          return { 'data-timestamp': attributes['data-timestamp'] };
        },
      },
      'data-url': {
        default: null,
        parseHTML: element => element.getAttribute('data-url'),
        renderHTML: attributes => {
          if (!attributes['data-url']) {
            return {};
          }
          return { 'data-url': attributes['data-url'] };
        },
      },
      'data-title': {
        default: null,
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes['data-title']) {
            return {};
          }
          return { 'data-title': attributes['data-title'] };
        },
      },
      'data-target': {
        default: null,
        parseHTML: element => element.getAttribute('data-target'),
        renderHTML: attributes => {
          if (!attributes['data-target']) {
            return {};
          }
          return { 'data-target': attributes['data-target'] };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        priority: 51, // Higher priority than default
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0];
  },
});
