# Troubleshooting Guide

This guide helps resolve common issues when developing or using the Sidebar Note extension.

## Development Issues

### 1. Build Errors

**Problem**: `npm run build` fails
**Solutions**:
- Ensure all dependencies are installed: `npm install`
- Check for syntax errors in JavaScript/JSX files
- Verify file paths in `vite.config.js`
- Clear node_modules and reinstall: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### 2. Manifest Validation Errors

**Problem**: Chrome rejects the extension with "Invalid manifest"
**Solutions**:
- Validate JSON syntax at https://jsonlint.com/
- Check all required fields are present
- Ensure permission names are correct
- Verify OAuth2 configuration format

### 3. Extension Not Appearing in Chrome

**Problem**: Extension doesn't show up after loading
**Solutions**:
- Check Developer Mode is enabled
- Verify all files are in the `dist` folder
- Check Chrome's extension error log
- Try reloading the extension

## Runtime Issues

### 1. Notes Not Saving

**Problem**: Notes disappear after browser restart
**Solutions**:
- Check Chrome's storage quota in Developer Tools
- Verify `storage` permission in manifest
- Check for errors in the background script
- Test with fewer/larger notes

### 2. Sidebar Not Opening

**Problem**: Clicking the extension icon does nothing
**Solutions**:
- Check `background.js` for errors
- Verify `sidePanel` permission in manifest
- Test with a fresh Chrome profile
- Check for conflicting extensions

### 3. Sync Functionality Not Working

**Problem**: Sync buttons show errors or do nothing
**Solutions**:
- Verify OAuth credentials in manifest
- Check network connectivity
- Review Chrome's identity API documentation
- Test with simplified sync implementation

## UI/UX Issues

### 1. Layout Problems

**Problem**: Elements appear misaligned or cut off
**Solutions**:
- Check CSS for syntax errors
- Verify responsive design with different window sizes
- Test in both light and dark mode
- Check for browser-specific CSS issues

### 2. Performance Issues

**Problem**: Slow loading or unresponsive UI
**Solutions**:
- Profile with Chrome's Performance tools
- Optimize rendering with React.memo or useMemo
- Limit notes loaded in memory
- Debounce frequent operations

## Debugging Techniques

### 1. Console Logging

Add strategic console.log statements:
```javascript
console.log('Debug point', { variable1, variable2 });
```

### 2. Chrome Developer Tools

- Inspect elements with right-click → "Inspect"
- Monitor network requests in the Network tab
- Check for errors in the Console tab
- Profile performance in the Performance tab

### 3. Storage Inspection

View stored data in Developer Tools:
1. Application tab
2. Storage → Local Storage
3. chrome-extension://[ID]

### 4. Background Script Debugging

Debug background scripts:
1. chrome://extensions
2. Enable "Collect errors"
3. Click "Inspect views" for background page

## Common Error Messages

### "Cannot read property 'xxx' of undefined"

**Cause**: Trying to access a property of a null/undefined value
**Solution**: Add null checks:
```javascript
if (obj && obj.property) {
  // Safe to use obj.property
}
```

### "Permission denied"

**Cause**: Missing permissions in manifest
**Solution**: Add required permissions to manifest.json

### "Quota exceeded"

**Cause**: Exceeded Chrome's storage limits
**Solution**: 
- Optimize data storage
- Implement data compression
- Consider alternative storage solutions

## Browser Compatibility

### Chrome Version Issues

**Problem**: Features not working in older Chrome versions
**Solutions**:
- Check Chrome's feature support documentation
- Implement feature detection
- Provide fallback implementations
- Specify minimum Chrome version in manifest

### Other Chromium Browsers

**Problem**: Extension not working in Brave, Edge, etc.
**Solutions**:
- Test in target browsers
- Check for browser-specific APIs
- Verify extension store requirements

## Data Migration

### Moving Notes Between Devices

1. Export data from source device
2. Transfer file securely
3. Import on destination device
4. Verify data integrity

### Version Upgrades

1. Backup existing data
2. Install new version
3. Test core functionality
4. Restore data if needed

## Security Considerations

### Data Privacy

- All data is stored locally by default
- Cloud sync requires explicit user action
- No automatic data transmission
- Users control their data

### Secure Development

- Never commit credentials to version control
- Validate all user inputs
- Sanitize content before rendering
- Use HTTPS for all external requests

## Performance Optimization

### Storage Optimization

- Compress large note content
- Implement pagination for note lists
- Cache frequently accessed data
- Clean up unused storage

### Rendering Optimization

- Use virtualized lists for many notes
- Implement proper React keys
- Avoid unnecessary re-renders
- Optimize CSS selectors

## Getting Help

### Community Resources

1. Chrome Extension documentation
2. React documentation
3. Stack Overflow
4. GitHub Issues

### Reporting Issues

When reporting issues, include:
1. Chrome version
2. Extension version
3. Steps to reproduce
4. Error messages
5. Screenshots if applicable

### Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Test thoroughly
5. Submit a pull request