
const UI_COLOR_BASE_VALUE = {
    opaque_background:"rgb(51, 66, 75)",
    background:"rgb(51, 66, 75)",
    border: "rgb(33, 38, 48)",
    title:"rgba(209,232,226,1)",
    close:"rgba(255, 255, 255,0.0)",
    hover:"rgba(255, 255, 255, 0.7)",
    node_tensorops:"rgb(188, 114, 150)",
    node_workspaces:"rgb(140, 141, 46)",
    node_components:"rgb(149, 160, 177)",
    node_activation:"rgb(135, 188, 114)",
}
export var UI_COLOR = JSON.parse(localStorage.getItem("UI_COLOR")) ?? JSON.parse(JSON.stringify(UI_COLOR_BASE_VALUE))
if(localStorage.getItem("UI_COLOR") == null) localStorage.setItem("UI_COLOR",JSON.stringify(UI_COLOR))

export function changeColor(key, color, scope="all"){
    if(scope === "all"){
        UI_COLOR[key] = color
    }else{
        if(scope === "r"){UI_COLOR[key] = "rgba("+color+", "+getColor(key)[1]+", "+getColor(key)[2]+","+getColor(key)[3]+")";}
        if(scope === "g"){UI_COLOR[key] = "rgba("+getColor(key)[0]+", "+color+", "+getColor(key)[2]+","+getColor(key)[3]+")";}
        if(scope === "b"){UI_COLOR[key] = "rgba("+getColor(key)[0]+", "+getColor(key)[1]+", "+color+","+getColor(key)[3]+")";}
        if(scope === "a"){UI_COLOR[key] = "rgba("+getColor(key)[0]+", "+getColor(key)[1]+", "+getColor(key)[2]+","+color+")";}
    }
    localStorage.setItem("UI_COLOR",JSON.stringify(UI_COLOR))
    UI_BORDER = "2px solid "+UI_COLOR.border;
}
export function resetColor(key=null){
    if(key)changeColor(key, UI_COLOR_BASE_VALUE[key]);
    else{localStorage.setItem("UI_COLOR",JSON.stringify(UI_COLOR_BASE_VALUE));
        UI_COLOR = UI_COLOR_BASE_VALUE;
    }
}

//if rgba
export function getColor(key, raw=false){
    if(raw){return UI_COLOR[key]}
    return UI_COLOR[key].match(/\d+/g).map(Number)
}


export var UI_BORDER = "2px solid "+UI_COLOR.border;
export var UI_BOX_SHADOW = 'inset 5px 5px 2px #00000040, inset -2px -2px 4px #ffffff10';

export const UI_STYLES = {
    title: {fontWeight: "bold", fontSize:"1em", padding:"0em 0.5em", color:UI_COLOR.title}
}

export function getNodeColor(node_type){
    let color = UI_COLOR.node_components
    switch (node_type) {
        case "workspace":
            color =  UI_COLOR.node_workspaces
            break;
        case "operation":
            color = UI_COLOR.node_tensorops
            break;
        case "component":
            color = UI_COLOR.node_components
            break;
        default:
            color =  UI_COLOR.node_components;
            break;
    }
    return color
}

resetColor()