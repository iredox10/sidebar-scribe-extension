// service-worker.js

// Handle the extension's action button click
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel in the current window
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

// Create a context menu item on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createNoteFromSelection",
    title: "Create Side Note with selected text",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "createNoteFromSelection") {
    // Ensure the side panel is open
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Send a message to the side panel script with the selected text
    // The App.jsx component will need to listen for this message
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "createNoteFromSelection",
        text: info.selectionText
      });
    }, 100); // A small delay to ensure the side panel is ready
  }
});
