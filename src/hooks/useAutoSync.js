import { useEffect, useRef, useState, useCallback } from 'react';
import { syncToGitHub } from '../utils/cloudSync';

export const useAutoSync = (notes, folders) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const timerRef = useRef(null);
  
  // Define sync function that can be called manually or automatically
  const triggerSync = useCallback(async (isManual = false) => {
    // If already syncing, don't trigger again unless forced? 
    // Actually better to prevent overlap.
    if (isSyncing) return;

    try {
      // Check if enabled (skip check if manual, or just check token presence)
      const result = await chrome.storage.local.get(['githubAutoSync', 'githubToken']);
      
      // If manual, we might want to sync even if auto-sync is off, provided we have a token.
      // But for consistency let's require a token at least.
      if (!result.githubToken) {
        if (isManual) throw new Error("No GitHub Token found. Please configure Settings.");
        return;
      }
      
      // If auto, check flag. If manual, ignore flag.
      if (!isManual && !result.githubAutoSync) {
        return;
      }

      setIsSyncing(true);
      setSyncError(null);
      
      console.log(`${isManual ? '🖱️ Manual' : '🔄 Auto'} syncing to GitHub...`);
      const response = await syncToGitHub(notes, folders);
      
      if (response.success) {
        setLastSyncTime(new Date());
        console.log('✅ Sync complete');
      } else {
        const msg = response.error || 'Unknown sync error';
        setSyncError(msg);
        console.error('❌ Sync failed details:', msg);
      }
    } catch (err) {
      const msg = err.message || 'Unknown network error';
      setSyncError(msg);
      console.error('❌ Sync exception:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [notes, folders, isSyncing]);

  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer (30 seconds debounce)
    timerRef.current = setTimeout(() => triggerSync(false), 30000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [triggerSync]); // Re-run when triggerSync changes (which changes when notes/folders change)

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    triggerSync: () => triggerSync(true) // Expose manual trigger
  };
};
