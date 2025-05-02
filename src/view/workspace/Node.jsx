import React from 'react';

export function NodeView({ node, onDragStart }) {
    return (
        <div
            onMouseDown={(e) => {
                e.stopPropagation();
                onDragStart(e);
            }}
            className="node"
            style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
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
        >
            {node.id}
        </div>
    );
}
