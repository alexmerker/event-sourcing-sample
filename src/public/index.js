// Eventsourcing
// loss less transactional model
// uses APPEND ONLY & IMMUTABLE

// current state (how it looks in our DB now)
var state = {
  position: [0, 0]
  // crash: [],
  // reachedLocation: []
};

// past events (should be persisted somewhere)
var eventLogold = [
  [
    {
      type: 'teleport',
      position: [0, 0],
      time: 1
    },
    {
      type: 'move',
      step: [1, 0],
      time: 2
    },
    {
      type: 'move',
      step: [1, 0],
      time: 3
    },
    {
      type: 'crash',
      culprit: '🧟',
      time: 4
    },
    {
      type: 'move',
      step: [0, 1],
      time: 5
    },
    {
      type: 'move',
      step: [0, 1],
      time: 6
    },
    {
      type: 'reachedLocation',
      location: '🚩',
      time: 7
    }
  ]
];
var eventLog = [];

// snapshots used to make replays faster (should be persisted somewhere)
var snapshots = [
  {
    type: 'snapshot',
    state: {
      coordinates: [1, 1],
      crashe: ['🚧']
    },
    pointintime: 3
  }
];

// complete rebuild (creates a projection state over the eventlog up to a particular point in time)
function replay(events, pointInTime) {
  console.log(pointInTime);
  if (typeof pointInTime === 'undefined') {
    pointInTime = events.length;
  }

  // reset state
  state = {};

  let time = 0;

  events.slice(0, pointInTime).forEach(event => {
    console.log(state);
    console.log(event);

    if (event.type === 'teleport') {
      state = replayEvent(state, event, applyTeleport);
      time += 1000;
    } else if (event.type === 'crash') {
      state = replayEvent(state, event, applyCrash);
    } else if (event.type === 'move') {
      state = replayEvent(state, event, applyMove);
      time += 1000;
    } else if (event.type === 'reachedLocation') {
      state = replayEvent(state, event, applyReachedLocation);
    }

    animateMove(state.position, time);
    animateState(state, time);
  });
}

function animateState(state, delay) {
  const _state = Object.assign({}, state);
  let timedPromise = new Promise((resolve, reject) => {
    let wait = setTimeout(() => {
      updateState(_state);
    }, delay);
  });
}

function animateMove(position, delay) {
  let timedPromise = new Promise((resolve, reject) => {
    let wait = setTimeout(() => {
      console.log('moved', position);
      moveBusEmoji(position);
    }, delay);
  });
}

function calcPosition(oldpos, step) {
  let newpos = [];
  newpos[0] = oldpos[0] + step[0];
  newpos[1] = oldpos[1] + step[1];
  return positionIsValid(newpos) ? newpos : oldpos;
}

function positionIsValid(pos) {
  const upper_boundary = 2;
  const lower_boundary = 0;
  const valid_upper = pos[0] <= upper_boundary && pos[1] <= upper_boundary;
  const valid_lower = pos[0] >= lower_boundary && pos[1] >= lower_boundary;
  return valid_lower && valid_upper;
}

function updateEventLog(eventLog) {
  let viewEl = document.getElementById('eventLog');
  let reversedEventLog = eventLog.slice(0).reverse();
  viewEl.innerHTML = JSON.stringify(reversedEventLog, undefined, 2);
}

function updateState(state) {
  let viewEl = document.getElementById('state');
  viewEl.innerHTML = JSON.stringify(state, undefined, 2);
}

function getCurrentPosition() {
  return this.state.coordinates;
}

function setState(newState) {
  this.state = newState;
}

function addToEventlog(state, event, applyToStateCallback) {
  event.time = eventLog.length + 1;
  eventLog.push(event);
  console.log(event);
  const newState = applyToStateCallback(state, event);
  return newState;
}

function replayEvent(state, event, applyToStateCallback) {
  const newState = applyToStateCallback(state, event);
  return newState;
}

/*  */

function applyCrash(state, event) {
  state.crash = event.culprit;
  return state;
}

function crash(culprit) {
  state.crash = culprit;
  const event = { type: 'crash', culprit: culprit };
  return event;
}

function applyReachedLocation(state, event) {
  console.log(state, event);

  state.reachedLocation = event.location;
  return state;
}

function reachedLocation(location) {
  state.reachedLocation = location;
  const event = { type: 'reachedLocation', location: location };
  return event;
}

function applyMove(state, event) {
  state.position = calcPosition(state.position, event.step);
  return state;
}

function move(step) {
  const event = { type: 'move', step: step };
  return event;
}

function applyTeleport(state, event) {
  state.position = event.position;
  return state;
}

function teleport(position) {
  return { type: 'teleport', position: position };
}

function load() {
  state = addToEventlog(state, teleport(state.position), applyTeleport);
  moveBusEmoji(state.position);
  updateEventLog(eventLog);
  updateState(state);
}

/* controls */
function keyboardcontrol(event) {
  console.log(state);
  // console.log(event.which);
  if (event.which == 82) {
    console.log('R');
  } // esc
  if (event.which == 32) console.log('space'); // space

  // left
  if (event.which == 37) {
    console.log('left', [-1, 0]);
    state = addToEventlog(state, move([-1, 0]), applyMove);
    moveBusEmoji(state.position);
  }

  // up
  if (event.which == 38) {
    console.log('up', [0, -1]);
    state = addToEventlog(state, move([0, -1]), applyMove);
    moveBusEmoji(state.position);
  }

  // right
  if (event.which == 39) {
    console.log('right', [1, 0]);
    state = addToEventlog(state, move([1, 0]), applyMove);
    moveBusEmoji(state.position);
  }

  // down
  if (event.which == 40) {
    console.log('down', [0, 1]);
    state = addToEventlog(state, move([0, 1]), applyMove);
    moveBusEmoji(state.position);
  }

  updateEventLog(eventLog);
  updateState(state);
}

document.addEventListener('keydown', keyboardcontrol);

/* render game */

function moveBusEmoji(newpos) {
  console.log(newpos);

  // clear the squares
  document.querySelectorAll('.square').forEach(square => {
    square.innerHTML = square.innerHTML.replace('🚌', '');
    square.innerHTML = square.innerHTML.replace('🎉', '');
    square.innerHTML = square.innerHTML.replace('💥', '');
  });

  // set bus at newpos
  el = document.querySelector('[coords="' + JSON.stringify(newpos) + '"]');

  if (el.innerHTML === '') {
    el.innerHTML = '🚌';
  } else if (el.innerHTML === '🚩') {
    state = addToEventlog(
      state,
      reachedLocation(el.innerHTML),
      applyReachedLocation
    );
    el.innerHTML = el.innerHTML + '🎉' + '🚌';
  } else {
    state = addToEventlog(state, crash(el.innerHTML), applyCrash);
    el.innerHTML = el.innerHTML + '💥' + '🚌';
  }
  return newpos;
}

/* helper methods */
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
