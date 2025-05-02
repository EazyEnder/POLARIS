import React, { useState, useEffect, useRef } from 'react';
import { Workspace } from '../../objects/workspace/Workspace';
import { Node } from '../../objects/workspace/Node';
import { NodeView } from './Node';

export function WorkspaceView(props) {
    const [workspace] = useState(props.workspace ?? new Workspace());
    const [refresh, setRefresh] = useState(false);
    const [draggingNodeId, setDraggingNodeId] = useState(null);
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (workspace.nodes.length === 0) {
            workspace.nodes.push(new Node());
            workspace.nodes.push(new Node());
            workspace.nodes[1].id = "dummy2";
            workspace.nodes[1].position.x = 200;
            workspace.nodes[1].position.y = 150;
            setRefresh(r => !r);
        }
    }, [workspace]);

    const handleStartDrag = (nodeId, mouseX, mouseY) => {
        const node = workspace.nodes.find(n => n.id === nodeId);
        if (node) {
            dragOffset.current = {
                x: mouseX - node.position.x,
                y: mouseY - node.position.y,
            };
            setDraggingNodeId(nodeId);
        }
    };

    const handleEndDrag = () => {
        setDraggingNodeId(null);
    };

    const handleDrag = (e) => {
        if (draggingNodeId === null) return;
        const node = workspace.nodes.find(n => n.id === draggingNodeId);
        if (node) {
            node.position.x = e.clientX - dragOffset.current.x;
            node.position.y = e.clientY - dragOffset.current.y;
            setRefresh(r => !r);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleEndDrag);
        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleEndDrag);
        };
    }, [draggingNodeId]);

    return (
        <div
            className="canvas"
            style={{ overflow: 'hidden', width: '100vw', height: '100vh', position: 'relative' }}
        >
            {workspace.nodes.map((node) => (
                <NodeView
                    key={node.id}
                    node={node}
                    onDragStart={(e) => handleStartDrag(node.id, e.clientX, e.clientY)}
                />
            ))}
        </div>
    );
}
