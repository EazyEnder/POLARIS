import React, { useState, useEffect, useRef } from 'react';
import {getTranslation} from '../config/Localization'
import { UI_COLOR, UI_STYLES, UI_BORDER, UI_BOX_SHADOW } from '../config/uiSettings';

function CollapsibleFile({ file, level, setObject, object, fullPath}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const hasChildren = file.type === 'folder' && file.children?.length;
  const path = `${fullPath}/${file.name}`;

  const click = () => {
    if(file.type === 'folder') {
      if(hasChildren){
        setIsOpen(prev => !prev);
      }
    }
    else if(file.type === 'file'){
      const ext = file.name.split('.')[file.name.split('.').length-1]
      if(ext === 'fits' || ext === 'npy'){
        setObject({"type":"CloudViewer","props":{"path":path}})
      }
    }
  };

  const isSelected = (path == object?.props?.path);

  return (
    <div style={{ marginLeft: level * 20, cursor: hasChildren ? 'pointer' : 'default', color:UI_COLOR.title}}>

      <div onClick={click}  onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{backgroundColor:isSelected || hover ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.0)"}}>
        {file.type === 'folder' ? (isOpen ? '📂' : '📁') : '📄'} {file.name}
      </div>

      {isOpen && hasChildren && (
        <div>
          {file.children.map((child, i) => (
            <CollapsibleFile key={i} file={child} level={level + 1} fullPath={path} setObject={setObject} object={object}/>
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorerView({setObject, object}) {
  const [path, setPath] = useState(null);
  const [files, setFiles] = useState([]);
  const divRef = useRef();

  useEffect(() => {
    if (path) {
      window.api.readFolder(path).then(setFiles);
    }
  }, [path]);

  const openFolderDialog = async () => {
    const selected = await window.api.selectFolder();
    if (selected) setPath(selected);
  };

  return (
    <div ref={divRef} style={{ width:"100%", height:"100%", padding: 0, backgroundColor: UI_COLOR.background, borderRightColor: UI_COLOR.border,  boxShadow: UI_BOX_SHADOW,}}>
        {!path && (
            <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center', textAlign: 'center', height: '100%'}}>
                  <div style={{...UI_STYLES.title, fontSize:"2em"}}>{getTranslation("ui_fe_openworkspace")}</div>
                  <button onClick={openFolderDialog}>{getTranslation("ui_fe_selectfolder")}</button>
            </div>
        )}
        {path && (
            <div>
            <div style={{...UI_STYLES.title, backgroundColor: UI_COLOR.node_components,overflow: 'hidden',borderBottom: UI_BORDER,width: '100%',height: '1.5em', borderRadius:"15px"}}>
                {getTranslation("ui_fe_filesin").toUpperCase()}{path.split("\\")[path.split("\\").length-1]}
            </div>
            {files.map((f, i) => (
                <CollapsibleFile key={i} file={f} level={0} setObject={setObject} fullPath={path} object={object}/>
            ))}
            </div>
        )}
    </div>
  );
}