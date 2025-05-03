import React, { useState, useEffect } from 'react';
import { UI_COLOR } from '../../config/uiSettings';

export function ConnectorView({connector, workspace, force_refresh, toCanvasScale}){

    const node_start = workspace.getNode(connector.from);
    const node_end = workspace.getNode(connector.to);

    let start_endpoint = node_start.getConnectorsPositions(window.innerWidth,window.innerHeight)[1];
    let end_endpoint = node_end.getConnectorsPositions(window.innerWidth,window.innerHeight)[0];
    start_endpoint.x = toCanvasScale(start_endpoint.x + node_start.position.x);
    start_endpoint.y = toCanvasScale(start_endpoint.y + node_start.position.y);
    end_endpoint.x = toCanvasScale(end_endpoint.x + node_end.position.x);
    end_endpoint.y = toCanvasScale(end_endpoint.y + node_end.position.y);

    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX,
        });
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragOffset.x;
        connector.midpoint_offset.x += dx;
        setDragOffset({ x: e.clientX});
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return(
        <>
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents:"none"}}>
            <defs>
                <mask id="circleMask">
                        <circle cx={(start_endpoint.x + end_endpoint.x) / 2 + connector.midpoint_offset.x} cy={(start_endpoint.y + end_endpoint.y) / 2} r={"100vw"} fill="white" />
                        <circle cx={(start_endpoint.x + end_endpoint.x) / 2 + connector.midpoint_offset.x} cy={(start_endpoint.y + end_endpoint.y) / 2} r={"0.5em"} fill="black" />
                </mask>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="2.5"
                    orient="auto"
                    markerUnits="strokeWidth"
                    >
                    <polygon points="0 0, 7 2.5, 0 5" fill={UI_COLOR.border} />
                </marker>
            </defs>
            <polyline
                points={`
                ${start_endpoint.x},${start_endpoint.y}
                ${(start_endpoint.x + end_endpoint.x) / 2  + connector.midpoint_offset.x},${start_endpoint.y}
                ${(start_endpoint.x + end_endpoint.x) / 2 + connector.midpoint_offset.x},${end_endpoint.y}
                ${end_endpoint.x},${end_endpoint.y}
                `}
                fill="none"
                stroke={UI_COLOR.background}
                strokeWidth="3"
                mask='url(#circleMask)'
                markerEnd="url(#arrowhead)"
            />
            <circle cx={(start_endpoint.x + end_endpoint.x) / 2 + connector.midpoint_offset.x} cy={(start_endpoint.y + end_endpoint.y) / 2} r={"0.3em"} fill={UI_COLOR.border}
            onMouseDown={handleMouseDown} onContextMenu={(e)=>{e.preventDefault();workspace.removeConnector(connector.id);force_refresh();}} style={{ pointerEvents: "auto", cursor: "pointer" }}/>
        </svg>
        </>
    )
}