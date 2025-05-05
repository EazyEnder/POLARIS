import { UI_COLOR } from '../../config/uiSettings';
import React, { useState, useEffect } from 'react';
import SearchWidget from '../widgets/SearchWidget';
import { getTranslation } from '../../config/Localization';

export function NodeCreator({nodeCreator, setNodeCreator}) {

    return(
        <div
            style={{
                position: 'absolute',
                left: nodeCreator.position.x,
                top: nodeCreator.position.y,
                pointerEvents: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.stopPropagation()}
        >
        <SearchWidget 
            position={[0, 0]}
            title={getTranslation("ui_nodecreator_title")}
        />
        </div>
    )
}