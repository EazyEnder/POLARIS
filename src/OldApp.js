import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [nodes, setNodes] = useState([
    { id: 'node1', x: 100, y: 100 },
    { id: 'node2', x: 400, y: 200 },
  ]);

  const [connections, setConnections] = useState([
    { from: 'node1', to: 'node2' },
  ]);

  const draggingNode = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const keysPressed = useRef({});

  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => (keysPressed.current[e.code] = true);
    const handleKeyUp = (e) => (keysPressed.current[e.code] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e, nodeId) => {
    if (e.button === 1 || keysPressed.current['Space']) {
      setIsPanning(true);
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      return;
    }

    draggingNode.current = nodeId;
    const node = nodes.find(n => n.id === nodeId);
    offset.current = {
      x: e.clientX - (node.x * zoom + pan.x),
      y: e.clientY - (node.y * zoom + pan.y),
    };
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
      return;
    }

    if (!draggingNode.current) return;

    const updatedNodes = nodes.map(node =>
      node.id === draggingNode.current
        ? {
            ...node,
            x: (e.clientX - pan.x - offset.current.x) / zoom,
            y: (e.clientY - pan.y - offset.current.y) / zoom,
          }
        : node
    );
    setNodes(updatedNodes);
  };

  const handleMouseUp = () => {
    draggingNode.current = null;
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const scaleFactor = 1.1;
      const newZoom = e.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;
      setZoom(Math.max(0.1, Math.min(5, newZoom)));
    }
  };

  const getNodeCenter = (node) => ({
    x: node.x + 75,
    y: node.y + 25,
  });

  return (
    <>
    <div
      className="canvas"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ overflow: 'hidden', width: '100vw', height: '100vh' }}
    >
      <div
        className="transform-layer"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <svg className="connection-layer" style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {connections.map((conn, index) => {
            const from = getNodeCenter(nodes.find(n => n.id === conn.from));
            const to = getNodeCenter(nodes.find(n => n.id === conn.to));
            return (
              <line
                key={index}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="black"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <div
            key={node.id}
            className="node"
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: 150,
              height: 50,
              background: '#eee',
              border: '1px solid #aaa',
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              userSelect: 'none',
            }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
          >
            {node.id}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
