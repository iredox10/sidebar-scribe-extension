// service-worker.js

// Handle the extension's action button click
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel in the current window
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

// Create context menu items on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createNoteFromSelection",
    title: "Create new note from selection",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "appendToCurrentNote",
    title: "Append selection to current note",
    contexts: ["selection"]
  });
});

// Handle messages from Content Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'triggerSidePanelAction') {
    const { menuItemId, selectionText, pageUrl, title } = message.data;
    
    // Simulate the context menu object
    const info = {
      menuItemId: menuItemId,
      selectionText: selectionText,
      pageUrl: pageUrl
    };
    
    // Simulate the tab object (basic properties needed)
    const tab = {
      id: sender.tab.id,
      windowId: sender.tab.windowId,
      url: pageUrl,
      title: title
    };
    
    // Call our existing handler logic
    // We can reuse the logic by extracting it or just copy-pasting the core "ensure open + send" flow.
    // For cleaner code, let's just run the same logic sequence:
    
    (async () => {
       // 1. Open Side Panel
       try {
         await chrome.sidePanel.open({ windowId: tab.windowId });
         await new Promise(r => setTimeout(r, 500));
       } catch(e) { console.error(e); }

       // 2. Send Message
       const payload = {
        action: info.menuItemId, 
        text: info.selectionText,
        sourceUrl: tab.url,
        sourceTitle: tab.title,
        messageId: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      
      sendMessageToSidePanel(payload);
    })();
  }
});

// Helper function to send message with retry logic
// This ensures that if the Side Panel is initializing, we don't drop the message
const sendMessageToSidePanel = (message, maxRetries = 10, interval = 500) => {
  const trySend = (retriesLeft) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        // Recipient likely not ready (Side Panel closed or loading)
        if (retriesLeft > 0) {
          console.log(`Message failed (Side Panel not ready?), retrying in ${interval}ms... (${retriesLeft} attempts left)`);
          setTimeout(() => trySend(retriesLeft - 1), interval);
        } else {
          console.error("Failed to send message to side panel after multiple retries. Is the panel open?", chrome.runtime.lastError);
        }
      } else {
        console.log("Message sent successfully to Side Panel");
      }
    });
  };
  
  // Start trying
  trySend(maxRetries);
};

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("📋 Context menu clicked:", info.menuItemId);
  
  // 1. Ensure Side Panel is Open
  // Use robust window ID detection
  let windowId = tab?.windowId;
  if (!windowId) {
    try {
      const window = await chrome.windows.getLastFocused();
      windowId = window.id;
    } catch (e) {
      console.warn("Could not get last focused window:", e);
    }
  }

  if (windowId) {
    try {
      // Must be called synchronously within the handler context, 
      // but since we awaited getLastFocused (which is microtask), 
      // we might have lost the user gesture in some strict environments?
      // Actually, async handlers usually preserve the gesture if the chain is clean.
      await chrome.sidePanel.open({ windowId });
      
      // Give the panel a moment to initialize if it was closed
      await new Promise(resolve => setTimeout(resolve, 500)); 
    } catch (e) {
      console.error("Could not open side panel:", e);
    }
  }

  // 2. Prepare Data
  // Fallback for title if undefined (common in some PDF viewers or raw files)
  let sourceTitle = tab.title;
  if (!sourceTitle || sourceTitle === "") {
    // Try to extract filename from URL
    try {
      const urlObj = new URL(tab.url);
      sourceTitle = urlObj.pathname.split('/').pop();
      if (sourceTitle.includes('.pdf')) {
        sourceTitle = decodeURIComponent(sourceTitle);
      }
    } catch (e) {
      sourceTitle = "External Source";
    }
  }

  const payload = {
    action: info.menuItemId, // matches "createNoteFromSelection" or "appendToCurrentNote"
    text: info.selectionText,
    sourceUrl: tab.url || info.pageUrl,
    sourceTitle: sourceTitle,
    messageId: Date.now().toString() + Math.random().toString(36).substr(2, 9) // Unique ID for deduplication
  };

  // 3. Send with Retry
  sendMessageToSidePanel(payload);
});
