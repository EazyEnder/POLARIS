import {  Component } from 'react'
import { WorkspaceView } from './workspace/Workspace';
import {WebSocketProvider} from '../config/useWebSocket';
import { FileExplorerView } from './FileExplorer';
import {ResizablePanel} from './widgets/ResizablePanel';
import { TerminalPanel } from './TerminalPanel';
import { UI_COLOR } from '../config/uiSettings';
import { LogoButton } from './LogoButton';


export default class ParentView extends Component {
    constructor(props){
        super(props)
        this.props = props;
        this.state = {
            refesh: false,
            children: [],
        }
    }

    refresh = () => {
        this.setState(prevState => ({
          refresh: !prevState.refresh
        }));
      };

    //Remove a child view using his id 
    removeChild = (id) => {
        this.state.children.forEach(child => {
            if(child.props.id == id && this.state.children.indexOf(child) > -1){this.state.children.splice(this.state.children.indexOf(child),1);}
        });
        this.setState(this.state);
    }

    //Don't forget to pass a prop:"key=YOUR_ID" and "id=YOUR_ID" in the JSX element
    addChild = (child) => {
        let flag = false;
        this.state.children.forEach(child2 => {
            if(child2.props.id == child.props.id){
                flag = true;
                return;
            }
        });
        if(flag){return;}
        this.state.children.push(child);
        this.setState(this.state);
    }

    /*A child can have a different type from another
     "CANVAS" : the child can only appear inside a canvas element
    "GLOBAL" : the child can only appear outside a canvas element */
    getChildren = (type) => {
        if(type == undefined){return(<>{this.state.children}</>)}
        let rebuild_children = []
        this.state.children.forEach(child => {
            if(child.type !== undefined && child.props.type == type){
                rebuild_children.push(child)
            }
        });
        return(<>{rebuild_children}</>)
    }

    render(){
        return(
            <WebSocketProvider url={"ws://localhost:8000/websocket?user_id=local"}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw' }}>
                <ResizablePanel
                    direction="horizontal"
                    initialSize={20}
                >
                    <div style={{ flex: 1, height:"100%", paddingRight: 3, overflow: 'hidden', boxSizing: 'border-box', backgroundColor: UI_COLOR.node_components}}>
                        <FileExplorerView />
                    </div>
                </ResizablePanel>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <ResizablePanel direction="vertical" initialSize={80}>
                    <WorkspaceView />
                    </ResizablePanel>

                    <div style={{ flex: 1, paddingTop: 3,  boxSizing: 'border-box', overflow: 'hidden', backgroundColor: UI_COLOR.node_components }}>
                        <TerminalPanel lines={['Test']} />
                    </div>
                </div>
                </div>
                <LogoButton removeChild={this.removeChild} addChild={this.addChild} refresh={this.refresh}/>
                {this.getChildren("GLOBAL")}  
            </WebSocketProvider>
        )
    }
}