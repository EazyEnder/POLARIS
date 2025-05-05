import { useState, useEffect } from 'react'
import ComponentWidget from "./ComponentWidget";
import { UI_COLOR, UI_BORDER } from '../../config/uiSettings';
import { getTranslation } from "../../config/Localization";
import './SearchWidget.css';

export default function SearchWidget(props) {

    const [size, setSize] = useState(props.size ?? { width: window.innerWidth / 5, height: window.innerHeight / 3 });
    const [position, setPosition] = useState(props.position ?? [window.innerWidth - size.width - 10, window.innerHeight - size.height - 10]);
    const METADATA = props.metadata;
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        function handleResize() {
            const newSize = props.size ?? { width: window.innerWidth / 5, height: window.innerHeight / 3 };
            setSize(newSize);
            setPosition(props.position ?? [window.innerWidth - newSize.width - 10, window.innerHeight - newSize.height - 10]);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const divstyle = {
        padding: "0",
        margin: "0",
        zIndex: "2",
        position: "absolute",
        width: "100%",
        height: "80%",
        backgroundColor: UI_COLOR.background,
        opacity: 1
    };

    const input_search_style = {
        width: "97%",
        height: "10%",
        backgroundColor: UI_COLOR.opaque_background,
        borderColor: UI_COLOR.border,
        color: "#FFF"
    };

    const list_style = {
        padding: "0",
        margin: "0",
        listStyleType: "none",
        height: "90%",
        overflowY: "auto"
    };

    const OBJECT_LIST = props.objects ?? ["test1", "test2", "test3"];

    return (
        <ComponentWidget icon={props.icon} border={UI_BORDER} topbarcolor={UI_COLOR.node_components} position={position} title={props.title ?? getTranslation("ui_widget_search")} isdeployed={props.isdeployed ?? true} deployable={props.deployable ?? false} size={size} deployable_side={false}>
            <div style={divstyle} className="fade-in">
                <input
                    placeholder={getTranslation("ui_widget_search_placeholder")}
                    style={input_search_style}
                    onInput={(event) => setSearchValue(event.target.value)}
                    onKeyUp={(event) => setSearchValue(event.target.value)}
                />
                <ul style={list_style}>
                    {getObjects(OBJECT_LIST, searchValue, props.onClick, METADATA)}
                </ul>
            </div>
        </ComponentWidget>
    );
}

function ListElement(props) {
    const [hover, setHover] = useState(false);

    return (
        <li
            style={{
                padding: "12px",
                textDecoration: "none",
                userSelect: "none",
                listStyleType: "none",
                backgroundColor: hover ? UI_COLOR.node_components : UI_COLOR.opaque_background,
                transition: "background-color 0.3s ease"
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => props.click(props.index, props.metadata)}
        >
            {props.object}
        </li>
    );
}

function getObjects(objects, filter, click, metadata) {
    const rows = [];
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].includes(filter)) {
            rows.push(
                <div className="slide-in" key={i}>
                    <ListElement index={i} click={click} metadata={metadata} object={objects[i]} />
                </div>
            );
        }
    }
    return <>{rows}</>;
}