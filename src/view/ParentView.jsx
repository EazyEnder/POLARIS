import {  Component } from 'react'
import { WorkspaceView } from './workspace/Workspace';
import {WebSocketProvider} from '../config/useWebSocket';

export default class ParentView extends Component {
    constructor(props){
        super(props)
        this.props = props;
        this.state = {}
    }

    refresh = () => {
        this.setState(!this.state);
    };

    render(){
        return(
            <WebSocketProvider url={"ws://localhost:8000/websocket?user_id=local"}>
            <div style={{width:"100%", height:"100%"}}>
                <WorkspaceView />
            </div>
            </WebSocketProvider>
        )
    }
}