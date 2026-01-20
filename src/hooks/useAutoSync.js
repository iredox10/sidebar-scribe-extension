import { useEffect, useRef, useState } from 'react';
import { syncToGitHub } from '../utils/cloudSync';

export const useAutoSync = (notes, folders) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const timerRef = useRef(null);
  
  useEffect(() => {
    // Debounce function to handle sync
    const triggerSync = async () => {
      try {
        // Check if enabled
        const result = await chrome.storage.local.get(['githubAutoSync', 'githubToken']);
        if (!result.githubAutoSync || !result.githubToken) {
          return;
        }

        setIsSyncing(true);
        setSyncError(null);
        
        console.log('🔄 Auto-syncing to GitHub...');
        const response = await syncToGitHub(notes, folders);
        
        if (response.success) {
          setLastSyncTime(new Date());
          console.log('✅ Auto-sync complete');
        } else {
          const msg = response.error || 'Unknown sync error';
          setSyncError(msg);
          console.error('❌ Auto-sync failed details:', msg);
        }
      } catch (err) {
        const msg = err.message || 'Unknown network error';
        setSyncError(msg);
        console.error('❌ Auto-sync exception:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer (30 seconds debounce)
    // We intentionally use a long debounce to avoid rate limits
    timerRef.current = setTimeout(triggerSync, 30000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [notes, folders]); // Re-run when data changes

  return {
    isSyncing,
    lastSyncTime,
    syncError
  };
};
