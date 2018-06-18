'use strict';

class State {
  constructor() {}

  set_coordinates(coords) {
    this.coordinates = coords;
  }

  set_crash(crashed) {
    this.crash = crashed;
  }

  set_reached_destination(destination) {
    this.reachedDestination = destination;
  }

  get_coordinates() {
    return this.coordinates;
  }

  get_state() {
    return this;
  }
}

module.exports = State;
