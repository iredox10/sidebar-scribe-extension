import { useState, useEffect } from 'react';

export const useUI = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [view, setView] = useState('main'); // 'main' or 'settings'
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearchDropdown && !event.target.closest('.search-container')) {
        setShowSearchDropdown(false);
      }
      if (showMoreActions && !event.target.closest('.more-actions')) {
        setShowMoreActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchDropdown, showMoreActions]);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const closeSidebar = () => setShowSidebar(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return {
    showSidebar,
    setShowSidebar,
    toggleSidebar,
    closeSidebar,
    view,
    setView,
    showSearch,
    setShowSearch,
    showSearchDropdown,
    setShowSearchDropdown,
    showMoreActions,
    setShowMoreActions,
    showCreationPanel,
    setShowCreationPanel,
    expandedFolders,
    toggleFolder
  };
};
