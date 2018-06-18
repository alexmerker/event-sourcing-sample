'use strict';

var GridService = require('./gridservice');
var State = require('./state');

class Vehicle {
  constructor(p_eventstore, start) {
    this.eventstore = p_eventstore;
    this.gridsrv = new GridService();
    this.state = new State();

    this.start(start);
  }

  start(coords) {
    //Persist application state (memory)
    this.state.set_coordinates(coords);
    const event = {
      coordinates: coords
    };

    //Persist event to the eventstore
    this.eventstore.log('start', event);
  }

  move(dir) {
    //Calculate and persist new application state (memory)
    this.state.set_coordinates(this.gridsrv.calc(this.state.coordinates, dir));

    const event = {
      direction: dir
    };

    //Persist event to the eventstore
    this.eventstore.log('move', event);
  }

  crash(culprit) {
    //Persist application state (memory) - vehicle has crashed!
    this.state.set_crash(culprit);

    const event = {
      culprit: culprit
    };

    //Persist event to the eventstore
    this.eventstore.log('crash', event);
  }

  get_state() {
    return this.state.get_state();
  }
}

module.exports = Vehicle;

//-----------------------
//  [0,0]  [1,0]  [2,0]
//  [0,1]  [1,1]  [2,1]
//  [0,2]  [1,2]  [2,2]
