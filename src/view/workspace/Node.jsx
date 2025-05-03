import ComponentWidget from '../widgets/ComponentWidget';
import { UI_COLOR, getNodeColor } from '../../config/uiSettings';
import React, { useState, useEffect } from 'react';

export function NodeView({ node, onDragStart, connectionBeingCreated,setConnectionBeingCreated, toCanvasScale }) {

    const node_type = node.type;
    let color = getNodeColor(node_type);
    const node_size_html = {width:toCanvasScale(node.size.width*window.innerWidth), height:toCanvasScale(node.size.height*window.innerHeight)}

    const connector_radius = toCanvasScale(0.0075*window.innerWidth)

    const handleConnectorClick = (isinput, e) => {
        e.stopPropagation();
        if(connectionBeingCreated){
            if(connectionBeingCreated.input == !isinput && connectionBeingCreated.node_start != node.id){
                setConnectionBeingCreated({
                    ...connectionBeingCreated,
                    node_end: node.id,
                })
            }
        }
        else setConnectionBeingCreated({input:isinput, node_start:node.id, x:e.clientX, y:e.clientY});
    };

    return (
        <>
        <div
            style={{
                position: 'absolute',
                left: toCanvasScale(node.position.x),
                top: toCanvasScale(node.position.y),
            }}
        >
            <div onMouseDown={(e) => {
                e.stopPropagation();
                onDragStart(e);
            }}>
            <ComponentWidget 
                position={[0, 0]} 
                title={node.name.toUpperCase()}
                size={node_size_html}
                deployable={false}
                borderRadius={'1vw'}
                topbarcolor={color}
            >
            </ComponentWidget>
            </div>
            <svg width={(node_size_html.width*1.5)} height={(node_size_html.height)} style={{position:"absolute", left:(-node_size_html.width*0.25), pointerEvents:"none"}} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="circleMaskRight">
                        <circle cx={(node_size_html.width*1.25)} cy={(node_size_html.height / 2)} r={connector_radius*1.2} fill="white" />
                        <rect x={(node_size_html.width*1.25)} y={(node_size_html.height / 2- connector_radius*1.2)} width={(connector_radius*1.2*1.25 * 2)} height={(connector_radius*1.2 * 2)} fill="black" />
                    </mask>
                    <mask id="circleMaskOuterRight">
                        <circle cx={(node_size_html.width*1.25)} cy={(node_size_html.height / 2)} r={connector_radius*1.4} fill="white" />
                        <rect x={(node_size_html.width*1.25)} y={(node_size_html.height / 2- connector_radius*1.4)} width={(connector_radius*1.25*1.4 * 2)} height={(connector_radius*1.4 * 2)} fill="black" />
                    </mask>
                    <mask id="circleMaskLeft">
                        <circle cx={(node_size_html.width*0.25)} cy={(node_size_html.height / 2)} r={connector_radius*1.2} fill="white" />
                        <rect x={toCanvasScale(0)} y={(node_size_html.height / 2- connector_radius*1.2)} width={(node_size_html.width*0.245)} height={(connector_radius*1.2 * 2)} fill="black" />
                    </mask>
                    <mask id="circleMaskOuterLeft">
                        <circle cx={(node_size_html.width*0.25)} cy={(node_size_html.height / 2)} r={connector_radius*1.4} fill="white" />
                        <rect x={toCanvasScale(0)} y={(node_size_html.height / 2- connector_radius*1.4)} width={(node_size_html.width*0.25)} height={(connector_radius*1.4 * 2)} fill="black" />
                    </mask>
                </defs> 
                <circle cx={(node_size_html.width*1.25)} cy={(node_size_html.height/2)} r={(connector_radius*1.4)} fill={UI_COLOR.border}  mask='url(#circleMaskOuterRight)'/>
                <circle cx={(node_size_html.width*1.25)} cy={(node_size_html.height/2)} r={(connector_radius*1.2)} fill={"white"}  mask='url(#circleMaskRight)'/>
                <circle cx={(node_size_html.width*1.25)} cy={(node_size_html.height/2)} r={(connector_radius)} fill={color} onClick={(args) => {handleConnectorClick(false,args);}} style={{ pointerEvents: "auto", cursor: "pointer" }}/>

                <circle cx={(node_size_html.width*0.25)} cy={(node_size_html.height/2)} r={(connector_radius*1.4)} fill={UI_COLOR.border}  mask='url(#circleMaskOuterLeft)'/>
                <circle cx={(node_size_html.width*0.25)} cy={(node_size_html.height/2)} r={(connector_radius*1.2)} fill={"white"}  mask='url(#circleMaskLeft)'/>
                <circle cx={(node_size_html.width*0.25)} cy={(node_size_html.height/2)} r={(connector_radius)} fill={color} onClick={(args) => {handleConnectorClick(true,args);}} style={{ pointerEvents: "auto", cursor: "pointer" }}/>
            </svg>
        </div>
        </>
    );
}