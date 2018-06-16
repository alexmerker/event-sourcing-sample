"use strict"

class State {
    constructor(){
    }

    set_coordinates(coords){
        this.coordinates = coords;
    }

    set_crash(crashed){
        this.crash = crashed; 
    }

    get_state(){
        return this;
    }
}

module.exports = State;