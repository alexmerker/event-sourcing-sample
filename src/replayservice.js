"use strict";

var State = require('./state');
var GridService = require('./gridservice');

class ReplayService {
    constructor(p_eventstore) {
        this.eventstore = p_eventstore;
        this.gridService = new GridService();
    }

    replay(time) {
        this.events = this.eventstore.getstore();
        if(time === undefined){
            time = this.events.length
        }
        return new Promise((resolve, reject) => {
            let evstore = this.events;
            resolve(this._replay(function* iterable() {

                //Starting at 1, the "start" event will be handled seperately
                for (let i = 1; i < (time); i++) {
                    let el = evstore[i].state_change.direction;
                    let cr = evstore[i].state_change.culprit;
                    if (el){
                        yield el;
                    }else if(cr){
                        yield cr;
                    }
                }
            }));
        });
    }

    _replay(iterable) {
        //Setting starting coordinates 
        var application_state = new State();
        let start = this.events[0].state_change.coordinates;
        application_state.set_coordinates(start);

        try {
            const g = iterable();
            while (true) {
                let direction = g.next()

                if (direction.done) {
                    return(application_state);
                    break;
                }
<<<<<<< HEAD
                //Calculating new vehicle position with gridService.calc(src, dir)
                application_state.set_coordinates(this.gridService.calc(
                    application_state.coordinates,
                    direction.value));
=======
                if(typeof direction.value === 'string'){
                    console.log("type is string!")
                    //Append all occured crashes
                    application_state.set_crash(direction.value);
                }else{
                    //Calculating new vehicle position with gridService.calc(src, dir)
                    application_state.set_coordinates(this.gridService.calc(
                        application_state.coordinates,
                        direction.value));
                }
>>>>>>> bugfix
            }
        } catch (error) {
            console.log("error", error)
        }
    }
}


module.exports = ReplayService;