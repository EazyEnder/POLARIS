import { generateUUID } from "../../config/utils";

export class Workspace {
    constructor(rawdata=null) {
        
        this.name = ""
        this.nodes = [];
        this.connectors = [];

        this.rawdata = rawdata;
        if(rawdata){
            this.load();
        }
    }

    load(){}

    createConnector(node_start_id, node_end_id, input){
        if(node_start_id == node_end_id){
            return;
        }

        const node_start = this.getNode(node_start_id);
        const node_end = this.getNode(node_end_id);

        if(node_start.inputs.includes(node_end_id) || node_start.outputs.includes(node_end_id)){
            return;
        }

        let new_connector = new Connector();

        if(input){
            node_start.inputs.push(node_end_id);
            node_end.outputs.push(node_start_id);
            new_connector.from = node_end_id;
            new_connector.to = node_start_id;
        }else{
            node_start.outputs.push(node_end_id);
            node_end.inputs.push(node_start_id);
            new_connector.from = node_start_id;
            new_connector.to = node_end_id;
        }
        this.connectors.push(new_connector)
        return new_connector;
    }

    getNode(node_id){
        return this.nodes.find(n => n.id === node_id);
    }

    getConnector(connector_id){
        return this.connectors.find(c => c.id === connector_id);
    }

    removeConnector(connector_id){
        let connector = this.getConnector(connector_id);
        const start_node = this.getNode(connector.from);
        const end_node = this.getNode(connector.to);

        let index = start_node.outputs.indexOf(end_node.id);
        if (index > -1) {
            start_node.outputs.splice(index, 1);
        }
        index = end_node.inputs.indexOf(start_node.id);
        if (index > -1) {
            end_node.inputs.splice(index, 1);
        }

        index = this.connectors.map((x)=>x.id).indexOf(connector.id);
        if (index > -1) {
            this.connectors.splice(index, 1);
        }
    }
}

class Connector {
    constructor(rawdata=null){

        this.id = generateUUID();
        this.from = null
        this.to = null
        this.midpoint_offset = {x:0}

        this.rawdata = rawdata;
        if(rawdata){
            this.load();
        }

    }

    load(){

    }
}