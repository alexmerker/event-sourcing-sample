"use strict"

class State {
    constructor(){
        this.state = {

        }
    }

    set_coordinates(coords){
        this.state.coordinates = coords;
    }

    set_crash(crashed){
        this.state.crash = crashed; 
    }

    get_state(){
        return this.state;
    }
}