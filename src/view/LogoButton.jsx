import LOGO_PATH from '../assets/logo.png';
import { useState, useEffect, useRef } from 'react';
import { getTranslation } from '../config/Localization';
import OptionsMenu from './interface/OptionsMenu';

export function LogoButton({removeChild, addChild, refresh}){

    return(
        <div style={{position: 'absolute', bottom: 0, alignItems: 'center', padding: '10px', display: 'flex'}}>
            <img src={LOGO_PATH} style={{aspectRatio: '1', width: '5vw'}}
            onClick={()=>{addChild(<OptionsMenu type={"GLOBAL"} key={"SETTINGS"} id={"SETTINGS"} refresh={refresh} removeChild={removeChild}/>)}}
            />
            <span
                style={{
                    color: 'white',fontWeight: 'bold',pointerEvents: 'none',textAlign: 'left', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}
            >
            POLARIS
            <br /> <div style={{textAlign:"left", fontWeight: 'normal', fontStyle: 'italic', fontSize:'0.9em'}}>{getTranslation("ui_logo_desc")} xx/05/2025</div>
            </span>
        </div>
        )
}