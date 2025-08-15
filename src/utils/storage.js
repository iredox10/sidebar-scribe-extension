// src/utils/storage.js

export const saveNotes = async (notes) => {
  try {
    await chrome.storage.local.set({ notes });
    return { success: true };
  } catch (error) {
    console.error('Error saving notes:', error);
    return { success: false, error };
  }
};

export const loadNotes = async () => {
  try {
    const result = await chrome.storage.local.get(['notes']);
    return { success: true, data: result.notes || [] };
  } catch (error) {
    console.error('Error loading notes:', error);
    return { success: false, error };
  }
};

export const saveFolders = async (folders) => {
  try {
    await chrome.storage.local.set({ folders });
    return { success: true };
  } catch (error) {
    console.error('Error saving folders:', error);
    return { success: false, error };
  }
};

export const loadFolders = async () => {
  try {
    const result = await chrome.storage.local.get(['folders']);
    return { success: true, data: result.folders || [] };
  } catch (error) {
    console.error('Error loading folders:', error);
    return { success: false, error };
  }
};

export const saveAllData = async (notes, folders) => {
  try {
    await chrome.storage.local.set({ notes, folders });
    return { success: true };
  } catch (error) {
    console.error('Error saving all data:', error);
    return { success: false, error };
  }
};

export const loadAllData = async () => {
  try {
    const result = await chrome.storage.local.get(['notes', 'folders']);
    return { 
      success: true, 
      notes: result.notes || [], 
      folders: result.folders || [] 
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    return { success: false, error };
  }
};