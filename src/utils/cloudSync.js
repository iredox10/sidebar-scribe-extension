// src/utils/cloudSync.js

// Helper to get GitHub config from storage
const getGitHubConfig = async () => {
  const result = await chrome.storage.local.get([
    'githubToken',
    'githubRepo',
    'githubBranch',
    'githubSyncMode'
  ]);
  
  if (!result.githubToken || !result.githubRepo) {
    throw new Error('GitHub configuration missing. Please check Settings.');
  }

  // Basic validation for repo format (username/repo)
  const repo = result.githubRepo.trim();
  if (!repo.includes('/') || repo.includes('github.com')) {
    throw new Error('Invalid Repository format. Use "username/repo" (e.g., "johndoe/notes").');
  }
  
  return {
    token: result.githubToken.trim(),
    repo: repo,
    branch: result.githubBranch ? result.githubBranch.trim() : 'main',
    mode: result.githubSyncMode || 'json'
  };
};

// Generic GitHub API Request
const githubRequest = async (endpoint, method, body, token) => {
  const url = `https://api.github.com${endpoint}`;
  console.log(`GitHub Request: ${method} ${url}`);
  
  const options = {
    method,
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorDetails = `Status: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('GitHub API Error Data:', errorData);
        
        // Handle specific permission error
        if (errorData.message === 'Resource not accessible by personal access token') {
          throw new Error("Permission Denied: Your Token lacks 'repo' scope. Please generate a new token with 'repo' permissions.");
        }

        if (errorData.message) errorDetails += ` - ${errorData.message}`;
        if (errorData.errors) errorDetails += ` - ${JSON.stringify(errorData.errors)}`;
      } catch (e) {
        if (e.message && e.message.includes("Permission Denied")) throw e;
        
        const text = await response.text();
        console.error('GitHub API Error Text:', text);
        errorDetails += ` - ${text.substring(0, 100)}`;
      }
      
      // Attach status to error object for logic handling
      const err = new Error(errorDetails);
      err.status = response.status;
      throw err;
    }
    
    return response.json();
  } catch (error) {
    // Network errors (e.g. offline)
    console.error('Network/Fetch Error:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// JSON Sync Implementation
// ----------------------------------------------------------------------

const syncJsonMode = async (notes, folders, config) => {
  const filePath = 'sidebar-notes-data.json';
  const content = JSON.stringify({
    version: '1.0',
    timestamp: new Date().toISOString(),
    folders,
    notes
  }, null, 2);
  
  // 1. Get current file SHA (if it exists)
  let sha = null;
  try {
    const fileData = await githubRequest(
      `/repos/${config.repo}/contents/${filePath}?ref=${config.branch}`, 
      'GET', 
      null, 
      config.token
    );
    sha = fileData.sha;
  } catch (e) {
    // File likely doesn't exist, which is fine for first push
    // If it's 404, we proceed. If 409 (conflict/empty repo), we proceed.
    if (e.status !== 404 && e.status !== 409) console.warn('Error checking file existence:', e);
  }
  
  // 2. Create/Update File
  const body = {
    message: `Sync notes: ${new Date().toLocaleString()}`,
    content: btoa(unescape(encodeURIComponent(content))), // Base64 encode handling UTF-8
    branch: config.branch
  };
  
  if (sha) {
    body.sha = sha;
  }
  
  await githubRequest(
    `/repos/${config.repo}/contents/${filePath}`, 
    'PUT', 
    body, 
    config.token
  );
  
  return { success: true, message: 'JSON backup synced successfully' };
};

// ----------------------------------------------------------------------
// Markdown Sync Implementation (Git Database API)
// ----------------------------------------------------------------------

const syncMarkdownMode = async (notes, folders, config) => {
  const { token, repo, branch } = config;

  let latestCommitSha = null;
  let baseTreeSha = null;
  let isInitialCommit = false;

  // 1. Try to Get Reference to HEAD
  try {
    const refData = await githubRequest(
      `/repos/${repo}/git/ref/heads/${branch}`, 
      'GET', 
      null, 
      token
    );
    latestCommitSha = refData.object.sha;
  } catch (error) {
    if (error.status === 404 || error.status === 409) {
      console.log('Branch or Ref not found. Assuming initial commit or empty repo.');
      isInitialCommit = true;
    } else {
      throw error;
    }
  }

  // 2. Get the Tree of the latest commit (if not initial)
  if (!isInitialCommit && latestCommitSha) {
    const commitData = await githubRequest(
      `/repos/${repo}/git/commits/${latestCommitSha}`, 
      'GET', 
      null, 
      token
    );
    baseTreeSha = commitData.tree.sha;
  }

  // 3. Build Tree Objects (Blobs and Paths)
  const treeItems = [];

  // Helper to find folder name
  const getFolderName = (id) => {
    const f = folders.find(f => f.id === id);
    return f ? f.name : '';
  };

  // Helper function to sanitize filenames
  const sanitize = (name) => name.replace(/[^a-z0-9 \-_]/gi, '').trim();

  for (const note of notes) {
    const folderName = note.folderId ? getFolderName(note.folderId) : '';
    const safeNoteName = sanitize(note.name) || `note-${note.id}`;
    const path = folderName 
      ? `${sanitize(folderName)}/${safeNoteName}.md`
      : `${safeNoteName}.md`;
      
    const content = note.content || '';
    
    treeItems.push({
      path: path,
      mode: '100644', // File blob
      type: 'blob',
      content: content
    });
  }
  
  // If list is empty but we want to initialize, create a README
  if (treeItems.length === 0) {
    treeItems.push({
      path: 'README.md',
      mode: '100644',
      type: 'blob',
      content: '# Sidebar Notes\n\nSynced notes.'
    });
  }

  // 4. Create a new Tree
  const treePayload = {
    tree: treeItems
  };
  
  // Only include base_tree if it exists
  if (baseTreeSha) {
    treePayload.base_tree = baseTreeSha;
  }

  const treeData = await githubRequest(
    `/repos/${repo}/git/trees`, 
    'POST', 
    treePayload, 
    token
  );
  const newTreeSha = treeData.sha;

  // 5. Create Commit
  const commitPayload = {
    message: `Sync notes (Markdown): ${new Date().toLocaleString()}`,
    tree: newTreeSha
  };
  
  // Only include parents if we have a previous commit
  if (latestCommitSha) {
    commitPayload.parents = [latestCommitSha];
  }

  const newCommitData = await githubRequest(
    `/repos/${repo}/git/commits`, 
    'POST', 
    commitPayload, 
    token
  );
  const newCommitSha = newCommitData.sha;

  // 6. Update Reference (Push)
  if (isInitialCommit) {
    // If branch didn't exist, create it
    await githubRequest(
      `/repos/${repo}/git/refs`, 
      'POST', 
      {
        ref: `refs/heads/${branch}`,
        sha: newCommitSha
      }, 
      token
    );
  } else {
    // If branch existed, update it
    await githubRequest(
      `/repos/${repo}/git/refs/heads/${branch}`, 
      'PATCH', 
      {
        sha: newCommitSha,
        force: false // Safe push
      }, 
      token
    );
  }

  return { success: true, message: 'Markdown files synced successfully' };
};

// ----------------------------------------------------------------------
// Main Export
// ----------------------------------------------------------------------

export const syncToGitHub = async (notes, folders) => {
  try {
    const config = await getGitHubConfig();
    
    if (config.mode === 'markdown') {
      return await syncMarkdownMode(notes, folders, config);
    } else {
      return await syncJsonMode(notes, folders, config);
    }
  } catch (error) {
    console.error('GitHub Sync Error:', error);
    return { success: false, error: error.message };
  }
};

export const syncToGoogleDrive = async () => {
  // Placeholder remains
  return { success: false, error: "Google Drive sync not implemented yet." };
};

export const prepareSyncData = (notes, folders) => {
  // Used only for JSON mode internal logic or legacy
  return { notes, folders };
};
