// Eventsourcing
// loss less transactional model
// uses APPEND ONLY & IMMUTABLE

// current state (how it looks in our DB now)
var state = {
  position: [0, 0],
  crash: [],
  reachedLocation: []
};

// past events (should be persisted somewhere)
var eventLogold = [
  { type: 'teleport', position: [0, 0], time: 0 },
  { type: 'move', step: [1, 0], time: 1 },
  { type: 'crash', culprit: ['🌴'], time: 2 },
  { type: 'move', step: [1, 0], time: 3 },
  { type: 'crash', culprit: ['🧟‍♂️'], time: 4 },
  { type: 'move', step: [0, 1], time: 5 },
  { type: 'crash', culprit: ['🚧'], time: 6 },
  { type: 'move', step: [0, 1], time: 7 },
  { type: 'reachedLocation', location: '🚩', time: 8 }
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

  let replayState = {
    position: null,
    crash: [],
    location: []
  };

  let time = 0;

  events.slice(0, pointInTime).forEach(event => {
    if (event.type === 'teleport') {
      replayState.position = event.position;
      time += 1000;
    } else if (event.type === 'crash') {
      crash(event.culprit);
    } else if (event.type === 'move') {
      replayState;
      time += 1000;
    } else if (event.type === 'reachedLocation') {
      replayState.locations.push(event.location);
    }
    animateMove(replayState.position, time);
    animateState(replayState, time);
  });

  return replayState;
}

function addToEventlog(event) {
  eventLog.push(event);
}

function animateState(state, delay) {
  const _state = Object.assign({}, state);
  let timedPromise = new Promise((resolve, reject) => {
    let wait = setTimeout(() => {
      console.log('thisstate', state);
      console.log('updated state', _state);
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

/*  */

function crash(culprit) {
  state.crash = culprit;
  addToEventlog({ type: 'crash', culprit: culprit });
}

function reachedLocation(location) {
  state.reachedLocation = location;
  addToEventlog({ type: 'reachedLocation', location: location });
}

function move(step) {
  state.position = calcPosition(state.position, step);
  addToEventlog({ type: 'move', step: step });
}

function teleport(position) {
  state.position = position;
  addToEventlog({ type: 'teleport', position: position });
}

function load() {
  teleport(state.position);
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
    move([-1, 0]);
    moveBusEmoji(state.position);
  }

  // up
  if (event.which == 38) {
    console.log('up', [0, -1]);
    move([0, -1]);
    moveBusEmoji(state.position);
  }

  // right
  if (event.which == 39) {
    console.log('right', [1, 0]);
    move([1, 0]);
    moveBusEmoji(state.position);
  }

  // down
  if (event.which == 40) {
    console.log('down', [0, 1]);
    move([0, 1]);
    moveBusEmoji(state.position);
  }

  updateEventLog(eventLog);
  updateState(state);
}

document.addEventListener('keydown', keyboardcontrol);

/* render game */

function moveBusEmoji(newpos) {
  // clear the squares
  document.querySelectorAll('.square').forEach(square => {
    square.innerHTML = square.innerHTML.replace('🚌', '');
    square.innerHTML = square.innerHTML.replace('🎉', '');
    square.innerHTML = square.innerHTML.replace('💥', '');
  });

  // set bus at newpos
  el = document.querySelector('[coords="' + JSON.stringify(newpos) + '"]');

  if (el.innerHTML === '') {
    delete state.reachedLocation;
    delete state.crash;
    el.innerHTML = '🚌';
  } else if (el.innerHTML === '🚩') {
    delete state.crash;
    reachedLocation(el.innerHTML);
    el.innerHTML = el.innerHTML + '🎉' + '🚌';
  } else {
    crash(el.innerHTML);
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
