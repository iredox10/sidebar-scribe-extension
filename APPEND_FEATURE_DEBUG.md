# Append to Current Note - Debug Guide

## Feature Overview
The "Append selection to current note" feature allows you to append selected text from any webpage to the currently open note in the extension.

## How to Test

### Step 1: Build and Load Extension
```bash
npm run build
```
Then reload the extension in Chrome at `chrome://extensions`

### Step 2: Open a Note
1. Click the extension icon to open the side panel
2. Select or create a note
3. Make sure the note is open in the editor

### Step 3: Append Text
1. Go to any webpage
2. Select some text
3. Right-click on the selected text
4. Choose "Append selection to current note"

## What Should Happen
1. The side panel should open (if not already open)
2. The selected text should be appended to your current note with:
   - A separator line (`---`)
   - A timestamp showing when it was added
   - The selected text content

## Debug Console Logs to Check

Open Chrome DevTools (F12) and check these logs:

### 1. Service Worker Console (Background Script)
- Go to `chrome://extensions`
- Find "Sidebar Note" extension
- Click "service worker" link
- You should see:
  - `📋 Context menu clicked: appendToCurrentNote`
  - `Selected text: [your selected text]`
  - `📎 Appending to current note`
  - `📤 Sending append message`

### 2. Side Panel Console
- Right-click in the side panel
- Choose "Inspect"
- You should see:
  - `📝 Append to current note action triggered`
  - `Current note: [note object]`
  - `Text to append: [your text]`
  - `✅ Appending to current note: [note name]`
  - `🔧 handleAppendToCurrentNote called`
  - `✅ New content created, length: [number]`
  - `📝 Note content changed, forcing editor re-render`

## Common Issues and Solutions

### Issue 1: Context Menu Not Showing
**Solution:** The extension needs to be reloaded after build
1. Go to `chrome://extensions`
2. Click the reload icon on the extension
3. Try again

### Issue 2: "No note selected" Message
**Solution:** Make sure a note is actually selected/open
1. Click on a note in the sidebar to select it
2. The note should appear in the editor
3. Then try appending

### Issue 3: Content Not Updating in Editor
**Solution:** This is what we're fixing with the editorKey force re-render
- Check if the console shows "Note content changed, forcing editor re-render"
- If not, there might be an issue with the noteContent prop not updating

### Issue 4: Message Not Being Received
**Solution:** Check both consoles
- If service worker logs show the message being sent but side panel doesn't receive it:
  - Try increasing the delay in service-worker.js (currently 300ms)
  - Make sure the side panel is fully loaded

## Code Flow

```
1. User right-clicks selected text
   ↓
2. service-worker.js - Context menu handler
   ↓
3. chrome.runtime.sendMessage() - Sends "appendToCurrentNote" action
   ↓
4. MessageListener.jsx - Receives the message
   ↓
5. App.jsx - handleAppendToCurrentNote()
   ↓
6. Updates noteContent state
   ↓
7. Updates note in storage via handleUpdateNoteContent()
   ↓
8. Editor.jsx - useEffect detects noteContent change
   ↓
9. Sets new editorKey to force SunEditor re-render
   ↓
10. SunEditor re-renders with new content
```

## Files Modified

1. **service-worker.js** - Added context menu and message handling
2. **MessageListener.jsx** - Added appendToCurrentNote action handler
3. **App.jsx** - Added handleAppendToCurrentNote function
4. **Editor.jsx** - Added editorKey state to force re-renders

## Testing Checklist

- [ ] Extension builds without errors
- [ ] Extension loads in Chrome
- [ ] Context menu shows both options
- [ ] Can create new note from selection (verify this works first)
- [ ] Can open/select a note
- [ ] Service worker console shows append logs
- [ ] Side panel console shows append logs
- [ ] Content appears in the editor
- [ ] Content persists after closing/reopening the note

## Manual Test Without Context Menu

If the context menu isn't working, you can test the append function directly in the console:

1. Open the side panel
2. Open DevTools (right-click > Inspect)
3. In the console, run:
```javascript
chrome.runtime.sendMessage({
  action: "appendToCurrentNote",
  text: "Test appended text"
});
```

This will simulate the context menu action and help isolate where the issue is.
