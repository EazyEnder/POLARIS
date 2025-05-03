import React, { useState, useEffect, useRef } from 'react';
import { Workspace } from '../../objects/workspace/Workspace';
import { Node } from '../../objects/workspace/Node';
import { NodeView } from './Node';
import { UI_COLOR } from '../../config/uiSettings';
import { ConnectorView } from './Connector';


export function WorkspaceView(props) {
    const [workspace] = useState(props.workspace ?? new Workspace());
    const [refresh, setRefresh] = useState(false);
    const [draggingNodeId, setDraggingNodeId] = useState(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [connectionBeingCreated, setConnectionBeingCreated] = useState(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleWheel = (e) => {
        //if (e.ctrlKey) {
            const scaleFactor = 1.1;
            const newZoom = e.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;
            setZoom(Math.max(0.1, Math.min(5, newZoom)));
        //}
      };

    useEffect(() => {
        if (workspace.nodes.length === 0) {
            workspace.nodes.push(new Node());
            workspace.nodes.push(new Node());
            workspace.nodes[1].type = "component";
            workspace.nodes[1].position.x = 200;
            workspace.nodes[1].position.y = 150;
            setRefresh(r => !r);
        }
    }, [workspace]);

    const toCanvasScale = (value, invert=false) => {
        if(invert)return value/zoom;
        else return value*zoom;
    }

    const force_refresh = () => {
        setRefresh(!refresh);
    }

    const handleStartDrag = (nodeId, mouseX, mouseY) => {
        const node = workspace.nodes.find(n => n.id === nodeId);
        if (node) {
            dragOffset.current = {
                x: toCanvasScale(mouseX, true) - node.position.x,
                y: toCanvasScale(mouseY, true) - node.position.y,
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
            node.position.x = toCanvasScale(e.clientX, true) - dragOffset.current.x;
            node.position.y = toCanvasScale(e.clientY, true) - dragOffset.current.y;
            setRefresh(r => !r);
        }
    };

    const handleMouseMove = (e) => {
        if (!connectionBeingCreated) return;
        setMousePos({ x: e.clientX, y: e.clientY});
    };

    const handleCanvasClick = (e) => {
        if (connectionBeingCreated) setConnectionBeingCreated(null);
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleEndDrag);
        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleEndDrag);
        };
    }, [draggingNodeId]);

    useEffect(() => {
        if (connectionBeingCreated) {
            if('node_end' in connectionBeingCreated){
                workspace.createConnector(connectionBeingCreated.node_start, connectionBeingCreated.node_end, connectionBeingCreated.input);
                setConnectionBeingCreated(null);
                window.removeEventListener('mousemove', handleMouseMove);
            }else window.addEventListener('mousemove', handleMouseMove);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [connectionBeingCreated]);

    return (
        <div
            className="canvas"
            style={{ overflow: 'hidden', width: '100vw', height: '100vh', position: 'relative' }}
            onClick={handleCanvasClick}
            onWheel={handleWheel}
        >
            {connectionBeingCreated && (<svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <polyline
                    points={`
                    ${connectionBeingCreated.x},${connectionBeingCreated.y}
                    ${(connectionBeingCreated.x + mousePos.x) / 2},${connectionBeingCreated.y}
                    ${(connectionBeingCreated.x + mousePos.x) / 2},${mousePos.y}
                    ${mousePos.x},${mousePos.y}
                    `}
                    fill="none"
                    stroke={UI_COLOR.background}
                    strokeWidth="3"
                />
            </svg>)}
            {workspace.connectors.map((connector) => (
                <ConnectorView
                    key={connector.id}
                    connector={connector}
                    workspace={workspace}
                    force_refresh={force_refresh}
                    toCanvasScale={toCanvasScale}
                />
            ))}
            {workspace.nodes.map((node) => (
                <NodeView
                    key={node.id}
                    node={node}
                    onDragStart={(e) => handleStartDrag(node.id, e.clientX, e.clientY)}
                    setConnectionBeingCreated={(e)=>{setMousePos({ x: e.x, y: e.y}); setConnectionBeingCreated(e);}}
                    connectionBeingCreated={connectionBeingCreated}
                    toCanvasScale={toCanvasScale}
                />
            ))}
        </div>
    );
}
