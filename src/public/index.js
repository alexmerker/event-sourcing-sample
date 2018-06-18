// Eventsourcing
// loss less transactional model
// uses APPEND ONLY & IMMUTABLE

// current state (how it looks in our DB now)
var state = {
  position: [2, 2],
  crashes: ['🌴', '🚧'],
  reached_locations: ['🚩']
};

// past events (should be persisted somewhere)
var eventLog = [
  { type: 'teleport', position: [0, 0], time: 0 },
  { type: 'move', step: [1, 0], time: 1 },
  { type: 'crash', culprit: ['🌴'], time: 2 },
  { type: 'move', step: [1, 0], time: 3 },
  { type: 'crash', culprit: ['🧟‍♂️'], time: 4 },
  { type: 'move', step: [0, 1], time: 5 },
  { type: 'crash', culprit: ['🚧'], time: 6 },
  { type: 'move', step: [0, 1], time: 7 },
  { type: 'reached_location', location: '🚩', time: 8 }
];

// snapshots used to make replays faster (should be persisted somewhere)
var snapshots = [
  {
    type: 'snapshot',
    state: {
      coordinates: [1, 1],
      crashes: ['🚧']
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
    crashes: [],
    locations: []
  };

  let time = 0;

  events.slice(0, pointInTime).forEach(event => {
    if (event.type === 'teleport') {
      replayState.position = event.position;
      time += 1000;
    } else if (event.type === 'crash') {
      replayState.crashes.push(event.culprit);
    } else if (event.type === 'move') {
      replayState.position = move(replayState.position, event.step);
      time += 1000;
    } else if (event.type === 'reached_location') {
      replayState.locations.push(event.location);
    }
    animateMove(replayState.position, time);
    animateState(replayState, time);
  });

  return replayState;
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

function move(oldpos, step) {
  const newpos = calc_position(oldpos, step);
  return position_is_valid(newpos) ? newpos : oldpos;
}

function calc_position(pos, step) {
  let res = [];
  res[0] = pos[0] + step[0];
  res[1] = pos[1] + step[1];
  return res;
}

function position_is_valid(pos) {
  const upper_boundary = 2;
  const lower_boundary = 0;
  const valid_upper = pos[0] <= upper_boundary && pos[1] <= upper_boundary;
  const valid_lower = pos[0] >= lower_boundary && pos[1] >= lower_boundary;
  return valid_lower && valid_upper;
}

function updateEventLog(eventLog) {
  let viewEl = document.getElementById('eventLog');
  viewEl.innerHTML = JSON.stringify(eventLog, undefined, 2);
}

function updateState(state) {
  let viewEl = document.getElementById('header');
  viewEl.innerHTML = JSON.stringify(state, undefined, 2);
}

function getCurrentPosition() {
  return this.state.coordinates;
}

function setState(newState) {
  this.state = newState;
}

function moveBusEmoji(newpos) {
  // clear the squares
  document.querySelectorAll('.square').forEach(square => {
    square.innerHTML = square.innerHTML.replace('🚌', '');
    square.innerHTML = square.innerHTML.replace('🎉', '');
    square.innerHTML = square.innerHTML.replace('💥', '');
  });

  // set bus at newpos
  newEl = document.querySelector('[coords="' + JSON.stringify(newpos) + '"]');

  if (newEl.innerHTML === '') {
    newEl.innerHTML = '🚌';
  } else if (newEl.innerHTML === '🚩') {
    newEl.innerHTML = newEl.innerHTML + '🎉' + '🚌';
  } else {
    newEl.innerHTML = newEl.innerHTML + '💥' + '🚌';
  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

function doMove(step) {
  moveBusEmoji(move(state.position, step));
}

document.addEventListener('keydown', function(event) {
  // console.log(event.which);
  if (event.which == 82) {
    console.log('R');
  } // esc
  if (event.which == 32) console.log('space'); // space

  // left
  if (event.which == 37) {
    console.log('left', [-1, 0]);
    doMove([-1, 0]);
  }

  // up
  if (event.which == 38) {
    console.log('up', [0, -1]);
    doMove([0, -1]);
  }

  // right
  if (event.which == 39) {
    console.log('right', [1, 0]);
    doMove([1, 0]);
  }

  // down
  if (event.which == 40) {
    console.log('down', [0, 1]);
    doMove([0, 1]);
  }
});
