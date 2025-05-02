
const UI_COLOR_BASE_VALUE = {
    opaque_background:"rgba(44, 53, 49, 1)",
    background:"rgba(44, 53, 49, 0.5)",
    border: "rgba(145,121,62,1)",
    title:"rgba(209,232,226,1)",
    close:"rgba(255, 255, 255,0.0)",
    hover:"rgba(255, 255, 255, 0.7)"
}
export var UI_COLOR = JSON.parse(localStorage.getItem("UI_COLOR")) ?? JSON.parse(JSON.stringify(UI_COLOR_BASE_VALUE))
if(localStorage.getItem("UI_COLOR") == null) localStorage.setItem("UI_COLOR",JSON.stringify(UI_COLOR))

export function changeColor(key, color, scope="all"){
    if(scope == "all"){
        UI_COLOR[key] = color
    }else{
        if(scope == "r"){UI_COLOR[key] = "rgba("+color+", "+getColor(key)[1]+", "+getColor(key)[2]+","+getColor(key)[3]+")";}
        if(scope == "g"){UI_COLOR[key] = "rgba("+getColor(key)[0]+", "+color+", "+getColor(key)[2]+","+getColor(key)[3]+")";}
        if(scope == "b"){UI_COLOR[key] = "rgba("+getColor(key)[0]+", "+getColor(key)[1]+", "+color+","+getColor(key)[3]+")";}
        if(scope == "a"){UI_COLOR[key] = "rgba("+getColor(key)[0]+", "+getColor(key)[1]+", "+getColor(key)[2]+","+color+")";}
    }
    localStorage.setItem("UI_COLOR",JSON.stringify(UI_COLOR))
    UI_BORDER = "2px solid "+UI_COLOR.border;
}
export function resetColor(key){
    changeColor(key, UI_COLOR_BASE_VALUE[key])
}

//if rgba
export function getColor(key, raw=false){
    if(raw){return UI_COLOR[key]}
    return UI_COLOR[key].match(/\d+/g).map(Number)
}


export var UI_BORDER = "2px solid "+UI_COLOR.border;

export const UI_STYLES = {
    title: {fontWeight: "bold", fontSize:"1em", padding:"0em 0.5em", color:UI_COLOR.title}
}
