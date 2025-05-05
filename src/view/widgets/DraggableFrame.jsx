import { useState, useEffect, useRef } from 'react';
import { UI_COLOR, UI_STYLES, UI_BORDER } from '../../config/uiSettings';
import IMG_CLOSE_GUI from '../../assets/close.png';

export default function DraggableFrame(props) {
  const [size, setSize] = useState(props.size ?? { width: window.innerWidth, height: window.innerHeight });
  const [position, setPosition] = useState(props.position ?? [size.width / 2, size.height / 2]);
  const [fullscreen, setFullscreen] = useState(false);

  const canberesize = props.canberesize ?? true;

  const dragPositions = useRef([0, 0]);

  useEffect(() => {
    function handleResize() {
      setSize(props.size ?? { width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    position: 'absolute',
    left: fullscreen ? 0 : position[0],
    top: fullscreen ? 0 : position[1],
    width: fullscreen ? size.width : undefined,
    height: fullscreen ? size.height : undefined,
    border: UI_BORDER,
    overflow: 'hidden',
    color: 'white',
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      style={containerStyle}
    >
      <div
        draggable
        style={{
          backgroundColor: UI_COLOR.node_components,
          overflow: 'hidden',
          userSelect: 'none',
          borderBottom: UI_BORDER,
          width: '100%',
          height: '1.5em',
          display: 'flex',
          alignItems: 'center',
        }}
        onDragStart={(event) => {
          event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);
          dragPositions.current = [event.clientX - position[0], event.clientY - position[1]];
        }}
        onDrag={(event) => {
          if (event.clientX === 0 && event.clientY === 0) return;
          let newX = event.clientX - dragPositions.current[0];
          let newY = event.clientY - dragPositions.current[1];
          newX = Math.max(5, Math.min(newX, size.width - 10));
          newY = Math.max(5, Math.min(newY, size.height - 10));
          setPosition([newX, newY]);
        }}
        onDragEnd={(event) => {
          let newX = event.clientX - dragPositions.current[0];
          let newY = event.clientY - dragPositions.current[1];
          newX = Math.max(5, Math.min(newX, size.width - 10));
          newY = Math.max(5, Math.min(newY, size.height - 10));
          setPosition([newX, newY]);
        }}
        onClick={(event) => {
          if (event.detail === 2) {
            setFullscreen(!fullscreen);
          }
        }}
      >
        {props.icon && (
          <img
            draggable={false}
            style={{ height: '1.5em', marginRight: 6 }}
            src={props.icon}
            alt="icon"
          />
        )}
        <div style={{ ...UI_STYLES.title, flexGrow: 1 }}>{props.title ?? ''}</div>
        <div
          style={{ backgroundColor: UI_COLOR.close, height: '100%', cursor: 'pointer' }}
          onClick={() => {
            if (props.id !== undefined && props.removeChild) {
              props.removeChild(props.id);
            }
          }}
        >
          <img draggable={false} src={IMG_CLOSE_GUI} width="100%" height="100%" alt="close" />
        </div>
      </div>

      <div
        style={{
          backgroundColor: UI_COLOR.background,
          overflow: 'auto',
          resize: canberesize ? 'both' : 'none',
          maxHeight: size.height,
          height: fullscreen ? size.height : undefined,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}