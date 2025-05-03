import { generateUUID } from "../../config/utils";

export class Node {
    constructor(rawdata=null){

        this.id = generateUUID();
        this.name = "Dummy";
        this.position = {x:0, y:0};
        this.size = {width:0.2,height:0.2}
        this.inputs = [];
        this.outputs = [];
        this.type = "";

        this.rawdata = rawdata;
        if(rawdata){
            this.load();
        }

    }

    load(){

    }

    getConnectorsPositions(vw, vh){
        return [{x:0,y:this.size.height*vh*.5},{x:this.size.width*vw,y:this.size.height*vh*.5}]
    }
}