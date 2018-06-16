"use strict"

var Eventstore = require('./eventstore');
var GridService = require('./gridservice');

class Vehicle {

    constructor(p_eventstore){
        this.eventstore = p_eventstore
        this.gridsrv = new GridService();
        this.start();
    }

    start(){
        this.eventstore.log("start", [0,0]);
    }

    left(src){
        let tofield = this.gridsrv.calc(src, [-1,0])
        this.eventstore.log("left", src, tofield)
    }

    right(src){
        let tofield = this.gridsrv.calc(src, [1,0])
        this.eventstore.log("right", src, tofield)
    }

    up(src){
        let tofield = this.gridsrv.calc(src, [0,-1])
        this.eventstore.log("up", src, tofield)
    }

    down(src){
        let tofield = this.gridsrv.calc(src, [0,1])
        this.eventstore.log("down", src, tofield)
    }
} 

module.exports = Vehicle;

//-----------------------
//  [0,0]  [1,0]  [2,0]
//  [0,1]  [1,1]  [2,1]
//  [0,2]  [1,2]  [2,2]