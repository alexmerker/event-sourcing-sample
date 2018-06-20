"use strict"

class Eventstore{

    constructor(){
        this.time = 0;
        this.store = [];
    }

    log(type, diff){
        let event = {
            "type":type,
            "state_change": diff,
            "time":this.gettime()
        }
        
        this.store.push(event)
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

    reset_timer(){
        this.time = 0;
    }
}

module.exports = Eventstore;

