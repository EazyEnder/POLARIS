import { useState, useEffect, useRef } from 'react';
import { UI_COLOR, UI_BORDER, UI_STYLES } from '../../config/uiSettings';

export default function ComponentWidget(props) {
    const [size, setSize] = useState(
        props.size ?? {
            width: props.width ?? window.innerWidth / 4,
            height: props.height ?? window.innerHeight / 4,
        }
    );
    const [position, setPosition] = useState(props.position ?? [0, 0]);
    const [isDeployed, setDeployed] = useState(props.isdeployed ?? true);
    const [isLoaded, setLoaded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);

    const contentRef = useRef(null);
    const deployable_side = props.deployable_side ?? true;

    let temp_size = props.size ?? {
        width: props.width ?? window.innerWidth / 4,
        height: props.height ?? window.innerHeight / 4,
    }
    if(size.width != temp_size.width && size.height != temp_size.height)setSize(temp_size);

    useEffect(() => {

        if (!isLoaded) setLoaded(true);

        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }

    }, [props.children]);

    const containerStyle = {
        position: props.placement ?? 'absolute',
        overflow: 'hidden',
        color: 'white',
        width: size.width,
        height: isDeployed ? size.height : 24,
        left: position[0],
        top: position[1] + (deployable_side ? 0 : (isDeployed ? 0 : size.height * 0.8)),
        opacity: isLoaded ? 1 : 0,
        transition: 'height 0.3s ease, top 0.3s ease, opacity 0.3s ease',
        backgroundColor: UI_COLOR.background,
        borderRadius: props.borderRadius ?? '0px',
    };

    const contentStyle = {
        height: isDeployed || !props.deployable ? contentHeight : 0,
        opacity: isDeployed || !props.deployable ? 1 : 0,
        overflow: 'auto',
        pointerEvents: isDeployed || !props.deployable ? 'auto' : 'none',
        transition: 'height 0.3s ease, opacity 0.3s ease',
    };

    return (
        <div
            onPointerDown={(event) => event.stopPropagation()}
            style={containerStyle}
        >
            <div
                style={{
                    backgroundColor: props.topbarcolor ?? UI_COLOR.border,
                    overflow: 'hidden',
                    userSelect: 'none',
                    borderBottom: UI_BORDER,
                    width: '100%',
                    height: '1.5em',
                    cursor: props.deployable ? 'pointer' : 'default',
                }}
                onClick={() => {
                    if (props.deployable) setDeployed(!isDeployed);
                }}
            >
                <div style={{ ...UI_STYLES.title, display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                    {props.icon && (
                        <img
                            draggable={false}
                            style={{
                                float: 'left',
                                marginLeft: '-0.5em',
                                marginRight: '0.5em',
                                height: '1.5em',
                            }}
                            src={props.icon}
                        />
                    )}
                    <span>
                    {props.title ?? ''}
                    </span>
                </div>

                {props.deployable && (
                    <div
                        style={{ height: '100%', float: 'right' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeployed(!isDeployed);
                        }}
                    >
                        {/**<img
                            draggable={false}
                            src={isDeployed ? DOWN_ARROW : UP_ARROW}
                            width={'100%'}
                            height={'100%'}
                        />*/}
                    </div>
                )}
            </div>

            <div ref={contentRef} style={contentStyle}>
                {props.children}
            </div>
        </div>
    );
}
