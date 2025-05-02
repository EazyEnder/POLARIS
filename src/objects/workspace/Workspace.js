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

    load(){
        //here come the load workspace
    }
}