import {useState, useEffect} from 'react'
import ComponentWidget from "./ComponentWidget";
import {UI_COLOR} from '../../config/uiSettings'
import { getTranslation } from "../../config/Localization";

export default function SearchWidget(props){

    const [size, setSize] = useState(props.size ?? {width:window.innerWidth/5,height:window.innerHeight/3});
    const [position, setPosition] = useState(props.position ?? [window.innerWidth-size.width-10,window.innerHeight-size.height-10])

    const METADATA = props.metadata;

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        function handleResize() {
            setSize(props.size ?? {width:window.innerWidth/5,height:window.innerHeight/3});
            setPosition(props.position ?? [window.innerWidth-size.width-10,window.innerHeight-size.height-10])
        }
        window.addEventListener('resize', handleResize);
    }, [])

    let divstyle = {};
    divstyle.padding = "0";
    divstyle.margin = "0";
    divstyle.zIndex = "2";
    divstyle.position = "absolute";
    divstyle.width = "100%";
    divstyle.height = "80%";
    divstyle.backgroundColor = UI_COLOR.background;
    divstyle.opacity = 1;

    let input_search_style ={}
    input_search_style.width = "98%";
    input_search_style.height = "10%";
    input_search_style.backgroundColor = UI_COLOR.opaque_background;
    input_search_style.borderColor = UI_COLOR.border;
    input_search_style.color = "#FFF";

    let list_style = {}
    list_style.padding = "0";
    list_style.margin = "0";
    list_style.listStyleType = "none";
    list_style.height = "90%";
    list_style.overflowY = "auto";

    //String list
    const OBJECT_LIST = props.objects ?? ["test1","test2","test3"]

    return(
        <ComponentWidget icon={props.icon} title={props.title ?? getTranslation("ui_widget_search")} isdeployed={props.isdeployed ?? true} deployable size={size} deployable_side={false}>
            <div style={divstyle}>
                <input placeholder={getTranslation("ui_widget_search_placeholder")} style={input_search_style}
                onInput={(event)=>setSearchValue(event.target.value)}
                onKeyUp={(event)=>setSearchValue(event.target.value)}
                />
                <ul style={list_style}>
                    {getObjects(OBJECT_LIST,searchValue,props.onClick,METADATA)}
                </ul>
            </div>
        </ComponentWidget>
    )

}

function ListElement(props){

    const [hover, setHover] = useState(false)

    return(
        <li style={{padding:"12px", textDecoration:"none", userSelect:"none", listStyleType:"none", backgroundColor: hover ?  UI_COLOR.borderColor : UI_COLOR.opaque_background}}
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            onClick={()=>props.click(props.index,props.metadata)}
        >
                {props.object}
        </li>
    )
}

function getObjects(objects,filter,click,metadata){
  
    const rows = [];
    for (let i = 0; i < objects.length; i++) {
        if(objects[i].includes(filter))
        rows.push(
            <ListElement key={i} index={i} click={click} metadata={metadata} object={objects[i]}/>
        );
    }
    return( 
        <>{rows}</>
    )
  }