import { useState } from 'react'
import { UI_BORDER, UI_COLOR, UI_STYLES } from '../../config/uiSettings';

/**
 * ## Range slider
 * @param {*} props <br />
 * ### Properties availables: <br/> 
 * #### Main function:
 * - **onSliderUpdate**: Triggered when value changes, the new value is in args <br />
 * #### Options:
 * - **baseValue**: Default value from 0 to 100, default:50.0 <br />
 * - **title**: Bar title, default: No title <br />
 * - **printValue**: Boolean: if true then the percentage value will be displayed in the title, default: true <br />
 * - **disableTitle**: Boolean: if true then the title will not be displayed, default: false <br />
 * - **maxValue**: default 100 <br />
 * - **minValue**: default 0 <br />
 * - **step**: default (maxValue-minValue)/100 <br />
 * #### Slider Style:
 * - **width**: Component width, default: 99% <br />
 * - **height**: Slider height, default: 1em <br />
 * - **backgroundColor**: Background Color, default: transparent, if you want to have transparency then use rgba and not hexa <br />
 * - **barColor**: Bar Color, default: Config, same rules that above... <br />
 * - **opacity**: Slider opacity, default: 0.7 <br />
 * - **transition**: Webkit Transition, default: ".2s" <br />
 */
export default function SliderWidget(props){

    const maxValue = props.maxValue ?? 100.
    const minValue = props.minValue ?? 0.
    const step = props.step ?? (maxValue-minValue)/100

    const [isHover, setIsHover] = useState(false);
    const [value, setValue] = useState(props.baseValue ?? ((maxValue-minValue)/2));

    const disableTitle = false;

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };
    

    return(
        <div style={{width:(props.width ?? "99%")}}>
            {!disableTitle && 
            <div style={{...UI_STYLES.title}}>
                {props.title ?? ""} {props.printValue !== undefined ? (props.printValue ? `(${value})` : "") : `(${value})`} :
            </div>
            }
            <div style={{borderBottom:UI_BORDER, height:(props.height ?? "1em")}}>
                <div style={{height:(props.height ?? "1em"), background:(props.barColor??UI_COLOR.opaque_background), width:`${(value-minValue)/(maxValue-minValue)*100}%`, position:"absolute", float:"left"}} />
                <input type={"range"} step={step} min={minValue} max={maxValue} value={value}
                style={{WebkitAppearance:"none", appearance:"none",
                    width:"100%", height:"100%", borderRadius: "0px",
                    background:(props.backgroundColor ?? "rgba(0,0,0,0.0)"),
                    outline: "none", opacity: isHover ? .7 : (props.opacity ?? 0.6),
                    WebkitTransition:(props.transition ?? ".2s"), transition:"opacity "+(props.transition ?? ".2s")}}
                onPointerEnter={handleMouseEnter}
                onPointerLeave={handleMouseLeave}
                onChange={(event)=>{
                    setValue(event.target.value);
                    if(props.onSliderUpdate !== undefined){ props.onSliderUpdate(value)};
                    }} />
            </div>
        </div>
    )
}