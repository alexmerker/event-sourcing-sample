"use strict"

var Eventstore = require('./eventstore');
var GridService = require('./gridservice');
var State = require('./state');

class Vehicle {

    constructor(p_eventstore, start){
        this.eventstore = p_eventstore;
        this.gridsrv = new GridService();
        this.state = new State();
        this.start(start);
    }

    start(coords){
        
        //Persist application state (memory)
        this.state.set_coordinates(coords);
        
        const event = {
            "coords":start
        }
        
        //Persist event to the eventstore
        this.eventstore.log("start", event);
    }

    move(dir){

        //Persist application state (memory)
        this.state = this.gridsrv.calc(this.state, dir)

        const event = {
            "direction":dir
        }

        //Persist event to the eventstore
        this.eventstore.log("move", event);
    }

    get_state(){
        return this.state.get_state();
    }
} 

module.exports = Vehicle;

//-----------------------
//  [0,0]  [1,0]  [2,0]
//  [0,1]  [1,1]  [2,1]
//  [0,2]  [1,2]  [2,2]