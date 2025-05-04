import React, { useRef, useEffect, useState } from 'react';
import { getNodeColor, UI_BORDER, UI_COLOR, UI_BOX_SHADOW } from '../../config/uiSettings';

export function WorkspaceMapView({ workspace }) {
  const mapRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const NODES = workspace.nodes;
  const positions = NODES.map((n) => n.position);

  // Get bounds
  let [min_x, max_x, min_y, max_y] = [null, null, null, null];
  positions.forEach(({ x, y }) => {
    if (min_x === null || x < min_x) min_x = x;
    if (max_x === null || x > max_x) max_x = x;
    if (min_y === null || y < min_y) min_y = y;
    if (max_y === null || y > max_y) max_y = y;
  });

  // Clamp helper
  const clamped = (val, min, max) => Math.max(min, Math.min(val, max));
  const dotSize = 5; // in %

  useEffect(() => {
    if (mapRef.current) {
      const { width, height } = mapRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const getPixelPos = (pos) => {
    const normX = max_x - min_x > 0 ? (pos.x - min_x) / (max_x - min_x) : 0;
    const normY = max_y - min_y > 0 ? (pos.y - min_y) / (max_y - min_y) : 0;
    const radiusX = (dotSize / 100) * dimensions.width * 0.5;
    const radiusY = (dotSize / 100) * dimensions.height * 0.5;

    const clampedX = clamped(normX, radiusX / dimensions.width, 1 - radiusX / dimensions.width);
    const clampedY = clamped(normY, radiusY / dimensions.height, 1 - radiusY / dimensions.height);

    return {
      x: clampedX * dimensions.width,
      y: clampedY * dimensions.height,
    };
  };

  return (
    <div
      ref={mapRef}
      style={{
        bottom: '20px',
        right: '20px',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        border: `1px solid ${UI_COLOR.border}`,
        overflow: 'hidden',
        boxShadow: UI_BOX_SHADOW,
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {workspace.connectors.map((connector, idx) => {
          const start = getPixelPos(workspace.getNode(connector.from).position);
          const end = getPixelPos(workspace.getNode(connector.to).position);
          const offsetX = max_x - min_x > 0 ? (connector.midpoint_offset.x * dimensions.width) / (max_x - min_x) : 0;
          const midX = (start.x + end.x) / 2 + offsetX;

          return (
            <polyline
              key={idx}
              points={`${start.x},${start.y} ${midX},${start.y} ${midX},${end.y} ${end.x},${end.y}`}
              fill="none"
              stroke={UI_COLOR.background}
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {NODES.map((node) => {
        const { x, y } = getPixelPos(node.position);
        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: `${dotSize}%`,
              backgroundColor: getNodeColor(node.type),
              border: UI_BORDER,
              transform: 'translate(-50%, -50%)',
              aspectRatio: '1',
            }}
          />
        );
      })}
    </div>
  );
}