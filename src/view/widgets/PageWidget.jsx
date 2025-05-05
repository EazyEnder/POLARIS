import { useState } from 'react'
import { UI_BORDER, UI_COLOR, UI_STYLES } from '../../config/uiSettings';

/**
 * ## Page Widget
 * Separate children component into pages
 * @param {*} props <br />
 * ### Properties availables: <br/> 
 * - **page**: Default page, default: 1 <br />
 * - **loop**: Boolean: If true then you will never stop skip pages (end <-> beginning), default: false<br />
 */
export default function PageWidget(props){

    const MAX_PAGE = props.children !== undefined ? props.children.length : 1;
    const default_page = props.page !== undefined ? ((props.page > MAX_PAGE ? MAX_PAGE : props.page) < 1 ? 1 : props.page) : 1;
    const LOOP_FLAG = props.loop ?? false;

    const incPage = () => {setPage(page+1)}

    const decPage = () => {setPage(page-1)}

    const setPage = (new_page) => {
        setFlatPage(verifPage(new_page));
    }

    const verifPage = (p) => {
        let np = p;
        if(p > MAX_PAGE){
            if(LOOP_FLAG){np = 1}
            else {np = MAX_PAGE}
        }
        else if(p < 1){
            if(LOOP_FLAG){np = MAX_PAGE}
            else {np = 1}
        }
        return np;
    }

    const [page, setFlatPage] = useState(verifPage(default_page));

    return(
        <>
            <div style={{backgroundColor:UI_COLOR.opaque_background, overflow: "hidden", userSelect:"none", borderBottom:UI_BORDER,
             width:"100%", height:"1.5em"}}>
                <div style={{backgroundColor:"red", height:"100%", float: "left", width:"5%"}} 
                    onClick={()=>{decPage()}}>
                </div>
                <div style={Object.assign({},UI_STYLES.title,{float: "left", zIndex:2, position:"absolute", left:"47.5%", textAlignLast:"center"})}>
                        {page}/{MAX_PAGE}
                </div>
                <div style={{backgroundColor:"green", height:"100%", float: "right", width:"5%"}} 
                    onClick={()=>{incPage()}}>
                </div>
                
            </div> 
            <div style={{float:"left"}}>
                {props.children !== undefined && props.children[page-1]}
            </div>
        </>
    )

}