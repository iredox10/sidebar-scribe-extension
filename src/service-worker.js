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

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("📋 Context menu clicked:", info.menuItemId);
  console.log("Selected text:", info.selectionText);
  
  if (info.menuItemId === "createNoteFromSelection") {
    console.log("➕ Creating new note from selection");
    // Ensure the side panel is open
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Send a message to the side panel script with the selected text
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "createNoteFromSelection",
        text: info.selectionText
      });
    }, 100); // A small delay to ensure the side panel is ready
  } else if (info.menuItemId === "appendToCurrentNote") {
    console.log("📎 Appending to current note");
    // Ensure the side panel is open
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Send a message to append to the current note with metadata
    setTimeout(() => {
      console.log("📤 Sending append message with metadata");
      chrome.runtime.sendMessage({
        action: "appendToCurrentNote",
        text: info.selectionText,
        metadata: {
          url: tab.url,
          title: tab.title,
          timestamp: new Date().toISOString()
        }
      });
    }, 300); // Increased delay to ensure side panel is ready
  }
});
