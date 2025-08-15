# Cloud Sync Implementation Guide

This guide explains how to implement the actual cloud sync functionality for Google Drive and GitHub.

## Google Drive Implementation

### Prerequisites

1. Google Cloud Project with Drive API enabled
2. OAuth 2.0 Client ID (Chrome App type)
3. Client ID added to manifest.json

### Implementation Steps

1. **Authentication**:
   ```javascript
   const getAuthToken = () => {
     return new Promise((resolve, reject) => {
       chrome.identity.getAuthToken({ interactive: true }, (token) => {
         if (chrome.runtime.lastError) {
           reject(chrome.runtime.lastError);
         } else {
           resolve(token);
         }
       });
     });
   };
   ```

2. **File Upload**:
   ```javascript
   const uploadToDrive = async (token, fileName, content) => {
     const metadata = {
       name: fileName,
       mimeType: 'application/json'
     };
     
     const form = new FormData();
     form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
     form.append('file', new Blob([content], { type: 'application/json' }));
     
     const response = await fetch(
       'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
       {
         method: 'POST',
         headers: new Headers({ 'Authorization': 'Bearer ' + token }),
         body: form
       }
     );
     
     return response.json();
   };
   ```

3. **Complete Integration**:
   Replace the placeholder in `src/utils/cloudSync.js`:
   ```javascript
   export const syncToGoogleDrive = async (notes, folders) => {
     try {
       const token = await getAuthToken();
       const syncData = prepareSyncData(notes, folders);
       
       // Create/update a file in Google Drive
       const result = await uploadToDrive(
         token, 
         'sidebar-notes-backup.json', 
         JSON.stringify(syncData, null, 2)
       );
       
       return { 
         success: true, 
         message: `Sync completed. File ID: ${result.id}` 
       };
     } catch (error) {
       console.error('Error syncing to Google Drive:', error);
       return { 
         success: false, 
         error: error.message || 'Failed to sync to Google Drive' 
       };
     }
   };
   ```

## GitHub Implementation

### Prerequisites

1. GitHub OAuth App registered
2. Client ID and Secret
3. Proper authorization callback URL configured

### Implementation Steps

1. **Authentication**:
   ```javascript
   const authenticateWithGitHub = () => {
     const clientId = 'YOUR_GITHUB_CLIENT_ID';
     const redirectUri = chrome.identity.getRedirectURL();
     const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
     
     return new Promise((resolve, reject) => {
       chrome.identity.launchWebAuthFlow({
         url: authUrl,
         interactive: true
       }, (redirectUrl) => {
         if (chrome.runtime.lastError) {
           reject(chrome.runtime.lastError);
         } else {
           const url = new URL(redirectUrl);
           const code = url.searchParams.get('code');
           resolve(code);
         }
       });
     });
   };
   ```

2. **Get Access Token**:
   ```javascript
   const getGitHubAccessToken = async (code) => {
     const response = await fetch('https://github.com/login/oauth/access_token', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
       body: JSON.stringify({
         client_id: 'YOUR_GITHUB_CLIENT_ID',
         client_secret: 'YOUR_GITHUB_CLIENT_SECRET',
         code: code
       })
     });
     
     const data = await response.json();
     return data.access_token;
   };
   ```

3. **Create/Update Gist**:
   ```javascript
   const syncToGitHubGist = async (token, notes, folders) => {
     const syncData = prepareSyncData(notes, folders);
     
     const response = await fetch('https://api.github.com/gists', {
       method: 'POST',
       headers: {
         'Authorization': `token ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         description: 'Sidebar Notes Backup',
         public: false,
         files: {
           'sidebar-notes.json': {
             content: JSON.stringify(syncData, null, 2)
           }
         }
       })
     });
     
     return response.json();
   };
   ```

4. **Complete Integration**:
   Replace the placeholder in `src/utils/cloudSync.js`:
   ```javascript
   export const syncToGitHub = async (notes, folders) => {
     try {
       const code = await authenticateWithGitHub();
       const token = await getGitHubAccessToken(code);
       const result = await syncToGitHubGist(token, notes, folders);
       
       return { 
         success: true, 
         message: `Sync completed. Gist URL: ${result.html_url}` 
       };
     } catch (error) {
       console.error('Error syncing to GitHub:', error);
       return { 
         success: false, 
         error: error.message || 'Failed to sync to GitHub' 
       };
     }
   };
   ```

## Testing the Implementation

1. Update `manifest.json` with your actual OAuth credentials
2. Build the extension with `npm run build`
3. Load the extension in Chrome
4. Click the sync buttons and follow the authentication flow
5. Check the cloud service for the uploaded data

## Error Handling

Implement proper error handling for:
- Network failures
- Authentication errors
- Rate limiting
- Invalid credentials
- Permission issues

## Security Considerations

- Never commit OAuth credentials to version control
- Use environment variables or secure storage for secrets
- Implement proper token refresh mechanisms
- Validate all data before syncing
- Use HTTPS for all API calls

## Best Practices

1. **Incremental Sync**: Only sync changed notes
2. **Conflict Resolution**: Handle conflicts when the same note is modified in both local and cloud
3. **Progress Indicators**: Show sync progress to users
4. **Offline Support**: Handle offline scenarios gracefully
5. **Data Validation**: Validate data before uploading