import DraggableFrame from "../widgets/DraggableFrame";
import PageWidget from "../widgets/PageWidget";
import SliderWidget from "../widgets/SliderWidget";
import { changeColor, getColor, resetColor, UI_COLOR } from "../../config/uiSettings";
import { rgbToHex } from "../..//config/utils";
import RESET_LOGO from "../../assets/reset.png"
import SETTINGS_LOGO from "../../assets/settings.png"
import ComponentWidget from "../widgets/ComponentWidget";

import { getTranslation} from "../../config/Localization";

export default function OptionsMenu(props){
    return(
        <DraggableFrame icon={SETTINGS_LOGO} canberesize={false} position={[2.*window.innerHeight/6,10+window.innerHeight/6]} removeChild={props.removeChild} title={getTranslation("ui_settings")} id={"SETTINGS"}>
            <br />
            <ComponentWidget title={getTranslation("ui_settings_menu_colors")} topbarcolor={UI_COLOR.opaque_background} placement="relative" deployable width="30vw" height="auto">
                <br />
                <b>- {getTranslation("ui_settings_color")}: </b>
                <input type="color" name="favcolor" value={rgbToHex(getColor("node_components",true))} onChange={(event)=>{changeColor("node_components",event.target.value); props.refresh()}}/>
                <img src={RESET_LOGO} draggable={false} style={{float:"left" , width:"2em"}} onClick={()=>{resetColor("node_components"); props.refresh()}}/>
            </ComponentWidget>
            {/**
             * Make a tool to quickly create settings instead of doing it manually for each one.
             * 
             * <ComponentWidget title={getTranslation("ui_settings_menu_systemscene")} topbarcolor={UI_COLOR.opaque_background} placement="relative" deployable width="30vw" height="auto">
                <br />
                <b>- {getTranslation("ui_settings_draworbits")}: </b>
                <input type="checkbox" name="favcolor" value={getSettings} onChange={(event)=>{changeColor("border",event.target.value); props.refresh()}}/>
                <img src={RESET_LOGO} draggable={false} style={{float:"left" , width:"2em"}} onClick={()=>{resetColor("border"); props.refresh()}}/>
            </ComponentWidget>*/}
        </DraggableFrame>
    )
}