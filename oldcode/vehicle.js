'use strict';

var GridService = require('./gridservice');
var State = require('./state');

class Vehicle {
  constructor(start) {
    this.state = new State();

    this.start(start);
  }

  start(coords) {
    this.state.set_coordinates(coords);
  }

  move(pos) {
      this.state.set_position();
  }

  crash(culprit) {
    this.state.set_crash(culprit);
  }

  reachedDestination(destination) {
    this.state.set_reached_destination(destination);
  }

  get_state() {
    return this.state.get_state();
  }

  reset() {
    this.state = new State();
    this.state.set_position([0, 0]);
  }
}

module.exports = Vehicle;

//-----------------------
//  [0,0]  [1,0]  [2,0]
//  [0,1]  [1,1]  [2,1]
//  [0,2]  [1,2]  [2,2]
