import React, { useState, useRef, useEffect } from 'react';

export function ResizablePanel({ direction = 'horizontal', initialSize = 20, min = 5, max = 95, onResize, children }) {
  const panelRef = useRef();
  const [size, setSize] = useState(initialSize);
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;

    let newSize;
    if (direction === 'horizontal') {
      newSize = (e.clientX / window.innerWidth) * 100;
    } else {
      newSize = (e.clientY / window.innerHeight) * 100;
    }

    newSize = Math.max(min, Math.min(max, newSize));
    setSize(newSize);
    if (onResize) onResize(newSize);
  };

  const handleMouseUp = () => setDragging(false);
  const handleMouseDown = () => setDragging(true);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const style = direction === 'horizontal'
    ? { width: `${size}%`, height: '100%', position: 'relative' }
    : { height: `${size}%`, width: '100%', position: 'relative' };

  const dragBarStyle = direction === 'horizontal'
    ? {
        position: 'absolute', top: 0, right: 0, width: 5, height: '100%',
        cursor: 'col-resize', zIndex: 10, backgroundColor: 'transparent', userSelect: 'none' 
      }
    : {
        position: 'absolute', bottom: 0, left: 0, height: 5, width: '100%',
        cursor: 'row-resize', zIndex: 10, backgroundColor: 'transparent', userSelect: 'none' 
      };

  return (
    <div ref={panelRef} style={style}>
      {children}
      <div onMouseDown={handleMouseDown} style={dragBarStyle} />
    </div>
  );
}