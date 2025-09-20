import React, { useState, useRef, useEffect } from 'react';
import { FiMapPin, FiX, FiMove } from 'react-icons/fi';

const FloatingWindow = ({ 
  isOpen, 
  onClose, 
  children, 
  title = "Side Note", 
  isPinned = false, 
  onTogglePin 
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // Handle dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.floating-window-header')) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Constrain window to viewport
  useEffect(() => {
    const constrainPosition = () => {
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        setPosition(prev => ({
          x: Math.max(0, Math.min(prev.x, viewportWidth - rect.width)),
          y: Math.max(0, Math.min(prev.y, viewportHeight - rect.height))
        }));
      }
    };

    window.addEventListener('resize', constrainPosition);
    return () => window.removeEventListener('resize', constrainPosition);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      className={`floating-window ${isPinned ? 'floating-window--pinned' : ''}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 10000,
        minWidth: '320px',
        maxWidth: '600px',
        minHeight: '400px',
        maxHeight: '80vh',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="floating-window-header" style={{
        padding: '8px 12px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiMove size={14} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            {title}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={onTogglePin}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPinned ? 'var(--accent-color)' : 'var(--text-secondary)',
              backgroundColor: isPinned ? 'var(--accent-bg)' : 'transparent'
            }}
            title={isPinned ? 'Unpin window' : 'Pin window on top'}
          >
            <FiMapPin size={14} />
          </button>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
            title="Close floating window"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </div>
    </div>
  );
};

export default FloatingWindow;
