'use strict';

var db = require('db');

class State {
  constructor() {}

  set_position(coords) {
    this.position = coords;

    persist()
  }

  set_crash(crashed) {
    this.crash = crashed;

    persist()
  }

  get_reached_destionation(){
    return this.reachedDestination;
  }

  set_reached_destination(destination) {
    this.reachedDestination = destination;

    persist();
  }

  get_position() {
    return this.position;
  }

  get_state() {
    db.getState(someParam)
  }

  //Write the application state into the database
  persist(){
    //Overwrite vehicle state into the database (not append!)
    db.persistState(this.state);
  }
}

module.exports = State;
