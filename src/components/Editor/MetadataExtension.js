import { Node, mergeAttributes } from '@tiptap/core';

export const MetadataBlock = Node.create({
  name: 'metadataBlock',

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      metadataId: {
        default: null,
      },
      timestamp: {
        default: null,
      },
      url: {
        default: null,
      },
      title: {
        default: null,
      },
      isDark: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.metadata-container',
        getAttrs: (dom) => {
          return {
            metadataId: dom.getAttribute('data-metadata-id'),
            timestamp: dom.getAttribute('data-timestamp'),
            url: dom.getAttribute('data-url'),
            title: dom.getAttribute('data-title'),
            isDark: dom.classList.contains('dark-mode'),
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { metadataId, timestamp, url, title, isDark } = node.attrs;
    
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `metadata-container ${isDark ? 'dark-mode' : ''}`,
        'data-metadata-id': metadataId,
        'data-timestamp': timestamp,
        'data-url': url,
        'data-title': title,
        style: `position: relative; margin: 16px 0; padding: 14px; padding-right: 42px; border-left: 3px solid #667eea; background-color: ${isDark ? '#374151' : '#f8f9fa'}; border-radius: 4px;`,
      }),
      [
        'button',
        {
          type: 'button',
          class: 'metadata-toggle-btn',
          'data-target': metadataId,
          style: 'position: absolute; top: 10px; right: 10px; cursor: pointer; background: #667eea; color: white; width: 26px; height: 26px; border: none; border-radius: 50%; font-size: 14px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s ease;',
          title: 'Toggle source info',
        },
        'ⓘ',
      ],
      [
        'div',
        {
          id: metadataId,
          class: `metadata-info ${isDark ? 'dark-mode' : ''}`,
          style: `display: none; font-size: 12px; color: ${isDark ? '#e5e7eb' : '#666'}; margin-bottom: 12px; padding: 12px; background: ${isDark ? '#1f2937' : 'white'}; border-radius: 4px; border: 1px solid ${isDark ? '#4b5563' : '#ddd'};`,
        },
        [
          'div',
          { style: 'margin-bottom: 6px;' },
          [
            'strong',
            {},
            '📅 Date: ',
          ],
          timestamp || 'Unknown',
        ],
        [
          'div',
          { style: 'margin-bottom: 6px;' },
          [
            'strong',
            {},
            '🌐 Website: ',
          ],
          title || 'Unknown',
        ],
        [
          'div',
          { style: 'word-break: break-all;' },
          [
            'strong',
            {},
            '🔗 URL: ',
          ],
          [
            'a',
            {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
              style: 'color: #667eea; text-decoration: none;',
            },
            url,
          ],
        ],
      ],
      [
        'div',
        { class: 'metadata-content' },
        0,
      ],
    ];
  },
});
