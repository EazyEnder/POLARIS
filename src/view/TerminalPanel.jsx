import React, { useRef, useEffect } from 'react';
import { UI_COLOR, UI_BOX_SHADOW } from '../config/uiSettings';

export function TerminalPanel({ lines }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  return (
    <div
      style={{
        backgroundColor: UI_COLOR.background,
        color: UI_COLOR.title,
        borderTop: `1px solid ${UI_COLOR.border}`,
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        padding: '0px',
        height: '100%',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        boxShadow: UI_BOX_SHADOW,
      }}
    >
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}