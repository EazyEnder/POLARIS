export class Node {
    constructor(rawdata=null){

        this.id = "dummy";
        this.position = {x:0, y:0};
        this.inputs = [];
        this.outputs = [];
        this.type = "";

        this.rawdata = rawdata;
        if(rawdata){
            this.load();
        }

    }

    load(rawdata){

    }
}

class Connector {
    constructor(rawdata=null){

        this.from = null
        this.to = null

        this.rawdata = rawdata;
        if(rawdata){
            this.load();
        }

    }

    load(){

    }
}