"use strict"

class Eventstore{

    constructor(){
        this.time = 0;
        this.store = [];
    }

    log(type, from_field, to_field){
        var event;

        console.log("type", type, " ff", from_field, " tf", to_field)

        if(type === "start"){
            event = {
                "type":type,
                "field":from_field,
                "time":this.gettime()
            }
        }
        else{
            event = {
                "type":type,
                "from_field":from_field,
                "to_field":to_field,
                "time":this.gettime()
            }
        }
        
        this.store.push(event)
    }

    getstate(){

    }

    gettime(){
        this.time++;
        return (this.time);
    }

    getstore(){
        return this.store;
    }

    setstore(store){
        this.store = store;
    }
}

module.exports = Eventstore;

