import React from 'react';
import './LoadingSquare.css';
import { getTranslation } from '../../config/Localization';
import { UI_COLOR } from '../../config/uiSettings';

const LoadingSquare = ({loading}) => {

  return (
      <div style={{position: 'absolute', top: "50%", left:"50%", transform: 'translate(-50%, -50%)', alignItems: 'center', padding: '10px', display: 'flex'}}>
          <div className="grid-container" style={{width: '5vw'}}>
            <div className="square box1" style={{backgroundColor:UI_COLOR.opaque_background}}></div>
            <div className="square box2" style={{backgroundColor:UI_COLOR.border}}></div>
            <div className="square box3" style={{backgroundColor:UI_COLOR.node_components}}></div>
            <div className="square box4" style={{backgroundColor:UI_COLOR.title}}></div>
          </div>
          <span
              style={{
                  color: 'white',fontWeight: 'bold',pointerEvents: 'none',textAlign: 'left', paddingLeft:"20px", textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
          >
          Loading
          <br /> <div style={{textAlign:"left", fontWeight: 'normal', fontStyle: 'italic', fontSize:'0.9em'}}>{loading ?? ""} </div>
          </span>
      </div>
  );
};

export default LoadingSquare;