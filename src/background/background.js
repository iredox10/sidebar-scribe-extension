// background.js
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel
  await chrome.sidePanel.open({ windowId: tab.windowId });
  
  // Get settings to determine default folder
  try {
    const result = await chrome.storage.local.get(['settings']);
    const settings = result.settings || {};
    
    // Send a message to the side panel to create a new note in the default folder
    // This would be handled in the main app
  } catch (error) {
    console.error('Error getting settings:', error);
  }
});

// Context menu for creating notes from selected text
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createNote",
    title: "Create note with selected text",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "createNote") {
    // Open side panel
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Send message with selected text
    chrome.runtime.sendMessage({
      action: "createNoteFromSelection",
      text: info.selectionText
    });
  }
});