import React, { useRef, useEffect } from 'react';
import { UI_COLOR, UI_BOX_SHADOW, UI_STYLES, UI_BORDER } from '../config/uiSettings';
import { getTranslation } from '../config/Localization';

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
      <div style={{display: 'flex',alignItems: 'center',justifyContent: 'flex-start',backgroundColor: UI_COLOR.node_components,
                    overflow: 'hidden',borderBottom: UI_BORDER,width: '50%',height: '1.5em',borderTopRightRadius: "0px",
                    borderBottomRightRadius: "30px",paddingLeft: "0px",...UI_STYLES.title}}>
        {getTranslation("ui_terminal").toUpperCase()}
      </div>
      <div style={{paddingLeft:"10px", paddingRight:"10px"}}>
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}