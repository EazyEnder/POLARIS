import {  Component } from 'react'
import { WorkspaceView } from './workspace/Workspace';
import {WebSocketProvider} from '../config/useWebSocket';
import { FileExplorerView } from './FileExplorer';
import { getTranslation } from '../config/Localization';
import {ResizablePanel} from './widgets/ResizablePanel';
import { TerminalPanel } from './TerminalPanel';
import { UI_COLOR } from '../config/uiSettings';

export default class ParentView extends Component {
    constructor(props){
        super(props)
        this.props = props;
        this.state = {
            refesh: false,
        }
    }

    refresh = () => {
        this.setState(prevState => ({
          refresh: !prevState.refresh
        }));
      };

    render(){
        return(
            <WebSocketProvider url={"ws://localhost:8000/websocket?user_id=local"}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw' }}>
                <ResizablePanel
                    direction="horizontal"
                    initialSize={20}
                >
                    <div style={{ flex: 1, height:"100%", padding: 5, boxSizing: 'border-box', backgroundColor: UI_COLOR.node_components}}>
                        <FileExplorerView />
                    </div>
                </ResizablePanel>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <ResizablePanel direction="vertical" initialSize={80}>
                    <WorkspaceView />
                    </ResizablePanel>

                    <div style={{ flex: 1, padding: 5,  boxSizing: 'border-box', backgroundColor: UI_COLOR.node_components }}>
                        <TerminalPanel lines={['Test']} />
                    </div>
                </div>
                </div>
            </WebSocketProvider>
        )
    }
}