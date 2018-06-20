'use strict';

class State {
    constructor(){
        this.crash = [];
    }

  set_coordinates(coords) {
    this.coordinates = coords;
  }

  set_reached_destination(destination) {
    this.reachedDestination = destination;
  }

  set_crash(crashed){
      this.crash.push(crashed); 
  }

  get_state(){
      return this;
  }

  get_coordinates(){
      return this.coordinates;
  }
}

module.exports = State;
