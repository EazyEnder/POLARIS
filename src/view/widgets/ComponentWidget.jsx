import {useState, useEffect, useRef} from 'react'
import {UI_COLOR, UI_BORDER, UI_STYLES} from '../../config/uiSettings'
import { useSpring, animated } from "@react-spring/web";

/**
 * 
 * Props:
 * size, position, title, icon, deployable, deployable_side
 */
export default function ComponentWidget(props){

    const [size, setSize] = useState(props.size ?? {width:props.width ?? window.innerWidth/4,height:props.height ?? window.innerHeight/4});
    const [position, setPosition] = useState(props.position ? props.position : [0,0]);
    const [isDeployed, setDeployed] = useState(props.isdeployed ?? false)
    const [isLoaded, setLoaded] = useState(false)

    const contentRef = useRef();
    const [measuredHeight, setMeasuredHeight] = useState(0);

    //true for top, false for bottom
    const deployable_side = props.deployable_side ?? true;

    const animationStyle = useSpring({
        opacity: isLoaded ? 1. : 0.,
        top: position[1] + (deployable_side ? 0 : (isDeployed ? 0 : size.height * 0.8)),
        height: isDeployed ? size.height : 24,
        config: { tension: 150, friction: 26 },
      });

      useEffect(() => {
        if (contentRef.current) {
            setMeasuredHeight(contentRef.current.scrollHeight);
        }
        }, [props.children]);

      const animationStyleInside = useSpring({
        height: isDeployed || !props.deployable ? measuredHeight : 0,
        opacity: isDeployed || !props.deployable ? 1 : 0,
        config: { tension: 170, friction: 26 },
      });

    useEffect(() => {
        function handleResize() {
            setSize(props.size ?? {width:props.width ?? window.innerWidth/4,height:props.height ?? window.innerHeight/4});
        }
        window.addEventListener('resize', handleResize);
        if(!isLoaded)setLoaded(true);
    }, [])

    return(
        <animated.div onPointerDown={event => {event.stopPropagation()}} 
             style={{...animationStyle, position:props.placement??"absolute", overflow: "hidden", color:"white" ,width:size.width, height:size.height, left: position[0]}}>
                <div style={{backgroundColor:props.topbarcolor ?? UI_COLOR.border, overflow: "hidden", userSelect:"none", borderBottom:UI_BORDER, width:"100%", height:"1.5em"}}
                    onClick={()=>{if(props.deployable ?? false){setDeployed(!isDeployed)}}}>
                    <div style={Object.assign({},UI_STYLES.title,{float: "left"})}>
                        {props.title ?? ""}
                        {props.icon ? <img draggable={false} style={{float:"left", marginLeft:"-0.5em", marginRight:"0.5em", height:"1.5em"}} src={props.icon}/> : ""}
                    </div>

                    {(props.deployable ?? false) &&
                    <div style={{height:"100%", float: "right"}} 
                            onClick={()=>{setDeployed(!isDeployed)}}>
                            <img draggable={false} src={isDeployed ? DOWN_ARROW : UP_ARROW} width={"100%"} height={"100%"}/>
                    </div>
                    }
                </div>
                    <animated.div ref={contentRef} style={{...animationStyleInside, pointerEvents: (isDeployed || !props.deployable) ? "auto" : "none", backgroundColor:UI_COLOR.background, overflow: "auto"}}>
                        {props.children}
                    </animated.div>
        </animated.div>
    )

}