// Sidebar Note - Content Script

// Create the floating toolbar
let toolbarHost = null;
let currentSelectionText = '';

function createToolbar() {
  if (toolbarHost) return toolbarHost;

  const host = document.createElement('div');
  host.id = 'sidebar-scribe-highlight-tool';
  // Initially hidden
  host.style.cssText = 'position: absolute; z-index: 2147483647; display: none; pointer-events: none;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({mode: 'open'});
  
  // Styles
  const style = document.createElement('style');
  style.textContent = `
    .toolbar {
      background: #1e293b;
      color: white;
      border-radius: 8px;
      padding: 4px;
      display: flex;
      gap: 2px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      pointer-events: auto;
      animation: fadeIn 0.15s ease-out;
      border: 1px solid #334155;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .btn {
      background: transparent;
      border: none;
      color: #e2e8f0;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      white-space: nowrap;
      outline: none;
    }
    .btn:hover {
      background: #334155;
      color: #ffffff;
    }
    .divider {
      width: 1px;
      background: #475569;
      margin: 4px 2px;
    }
    svg { width: 14px; height: 14px; }
  `;
  shadow.appendChild(style);

  // Toolbar Container
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  
  // Create Buttons
  const createBtn = (text, iconPath, action) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.innerHTML = `
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}" />
      </svg>
      ${text}
    `;
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click handler from hiding it
      e.preventDefault();
      handleAction(action);
    });
    return btn;
  };

  // + New Note Button
  toolbar.appendChild(createBtn(
    'New Note', 
    'M12 4v16m8-8H4', 
    'createNoteFromSelection'
  ));

  // Divider
  const div = document.createElement('div');
  div.className = 'divider';
  toolbar.appendChild(div);

  // Append Button
  toolbar.appendChild(createBtn(
    'Append', 
    'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', 
    'appendToCurrentNote'
  ));

  shadow.appendChild(toolbar);
  toolbarHost = host;
  return host;
}

// Handle Button Clicks
function handleAction(action) {
  // Hide toolbar immediately
  if (toolbarHost) toolbarHost.style.display = 'none';

  // Send message to background script
  // We use the same structure as the context menu listener in service-worker.js expects
  // But wait, the context menu listener listens to chrome.contextMenus.onClicked.
  // We need to send a direct message to the service worker or side panel.
  // Actually, the service worker receives the context menu event. 
  // We should send a message to the Runtime that the Service Worker can forward, 
  // OR send directly to the side panel if we could (we can't target side panel easily from content script without an open port).
  // BEST APPROACH: Send to Service Worker, let it handle the "open side panel + forward" logic.
  // We need to add a message listener in service-worker.js for this.
  
  chrome.runtime.sendMessage({
    action: 'triggerSidePanelAction',
    data: {
      menuItemId: action,
      selectionText: currentSelectionText,
      pageUrl: window.location.href,
      title: document.title
    }
  });
}

// Logic to positioning
function updateToolbarPosition() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  currentSelectionText = text;

  if (text.length === 0) {
    if (toolbarHost) toolbarHost.style.display = 'none';
    return;
  }

  // Ensure toolbar exists
  const host = createToolbar();

  // Calculate position
  try {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Coordinates relative to the viewport + scroll
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Position above the selection
    // 50px above the top of the selection
    let top = rect.top + scrollY - 50;
    // Centered horizontally
    let left = rect.left + scrollX + (rect.width / 2) - 85; // 85 is approx half width of toolbar

    // Boundary checks
    if (top < 0) top = rect.bottom + scrollY + 10; // Show below if too high
    if (left < 0) left = 10;
    
    host.style.top = `${top}px`;
    host.style.left = `${left}px`;
    host.style.display = 'block';
  } catch (e) {
    console.error('Error positioning toolbar:', e);
  }
}

// Event Listeners using Debounce for performance
let debounceTimer;
document.addEventListener('mouseup', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updateToolbarPosition, 200);
});

document.addEventListener('keyup', (e) => {
  // Handle keyboard selection (Shift+Arrows)
  if (e.key === 'Shift' || e.key.startsWith('Arrow')) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateToolbarPosition, 200);
  }
});

// Hide on scroll or resize to prevent misalignment
window.addEventListener('scroll', () => {
  if (toolbarHost) toolbarHost.style.display = 'none';
}, { passive: true });

window.addEventListener('resize', () => {
  if (toolbarHost) toolbarHost.style.display = 'none';
}, { passive: true });

// Hide when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  // If clicking inside our toolbar, don't hide (handled by shadow dom check mostly, but good to be safe)
  if (toolbarHost && e.target !== toolbarHost) {
     // Allow a small delay to register clicks on the toolbar buttons if event order is tricky
     // But since toolbar is shadow DOM, the event target is the host.
     // If target IS the host, we are good.
     setTimeout(() => {
        // Double check selection
        const selection = window.getSelection();
        if (selection.toString().trim().length === 0) {
           toolbarHost.style.display = 'none';
        }
     }, 100);
  }
});
