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
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  } catch (e) {
    console.error("Could not open side panel:", e);
    // Continue anyway, it might be open already
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
