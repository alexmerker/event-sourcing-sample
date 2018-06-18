var state = { coordinates: [0, 0] };

document.addEventListener('keydown', function(event) {
  // console.log(event.which);
  if (event.which == 82) {
    console.log('R');
    resetVehicle().then(res => setState(res));
  } // esc
  if (event.which == 32) console.log('space'); // space

  // left
  if (event.which == 37) {
    console.log('left', [-1, 0]);
    move([-1, 0]).then(res => {
      const newPosition = res.coordinates;
      moveBusEmoji(newPosition);
      setState(res);
    });
  }

  // up
  if (event.which == 38) {
    console.log('up', [0, -1]);
    move([0, -1]).then(res => {
      const newPosition = res.coordinates;
      moveBusEmoji(newPosition);
      setState(res);
    });
  }

  // right
  if (event.which == 39) {
    console.log('right', [1, 0]);
    move([1, 0]).then(res => {
      const newPosition = res.coordinates;
      moveBusEmoji(newPosition);
      setState(res);
    });
  }

  // down
  if (event.which == 40) {
    console.log('down', [0, 1]);
    move([0, 1]).then(res => {
      const newPosition = res.coordinates;
      moveBusEmoji(newPosition);
      setState(res);
    });
  }
});

function updateEventLog() {
  let viewEl = document.getElementById('eventLog');
  getEvents().then(res => {
    console.log('getlog', viewEl);
    viewEl.innerHTML = JSON.stringify(res.reverse(), undefined, 2);
  });
}

function updateState() {
  let viewEl = document.getElementById('header');
  getState().then(res => {
    console.log('getstate', res);
    viewEl.innerHTML = JSON.stringify(res, undefined, 2);
  });
}

// function scrollIntoView() {
//   var elem = document.getElementById('eventLog');
//   console.log('elem', elem);

//   elem.scrollIntoView({ block: 'end' });
//   // window.scrollTo(0, document.querySelector('.eventLog').scrollHeight);
// }

function getCurrentPosition(newState) {
  console.log(this.state.coordinates);

  return this.state.coordinates;
}

function setState(newState) {
  this.state = newState;
}

function moveBusEmoji(newpos) {
  const oldpos = this.state.coordinates;
  console.log(oldpos, newpos);

  oldEl = document.querySelector('[coords="' + JSON.stringify(oldpos) + '"]');

  oldEl.innerHTML = oldEl.innerHTML.replace('🚌', '');
  oldEl.innerHTML = oldEl.innerHTML.replace('🎉', '');
  oldEl.innerHTML = oldEl.innerHTML.replace('💥', '');

  newEl = document.querySelector('[coords="' + JSON.stringify(newpos) + '"]');

  if (newEl.innerHTML === '') {
    newEl.innerHTML = '🚌';
  } else if (newEl.innerHTML === '🚩') {
    newEl.innerHTML = newEl.innerHTML + '🎉' + '🚌';
  } else {
    crash(newEl.innerHTML).then(res => {
      updateEventLog();
      updateState();
    });
    newEl.innerHTML = newEl.innerHTML + '💥' + '🚌';
  }

  updateEventLog();
  updateState();
}

function getEvents() {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        // XMLHttpRequest.DONE == 4
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText));
        } else if (xmlhttp.status == 400) {
          reject('400');
        } else {
          reject('unknown error');
        }
      }
    };

    xmlhttp.open('GET', '/get-events', true);
    xmlhttp.send();
  });
}

function getState() {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        // XMLHttpRequest.DONE == 4
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText));
        } else if (xmlhttp.status == 400) {
          reject('400');
        } else {
          reject('unknown error');
        }
      }
    };

    xmlhttp.open('GET', '/get-state', true);
    xmlhttp.send();
  });
}

function move(dir) {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        // XMLHttpRequest.DONE == 4
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText));
        } else if (xmlhttp.status == 400) {
          reject('400');
        } else {
          reject('unknown error');
        }
      }
    };

    console.log('/move/' + JSON.stringify(dir));

    xmlhttp.open('GET', '/move/' + JSON.stringify(dir), true);
    xmlhttp.send();
  });
}

function crash(culprit) {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        // XMLHttpRequest.DONE == 4
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText));
        } else if (xmlhttp.status == 400) {
          reject('400');
        } else {
          reject('unknown error');
        }
      }
    };

    xmlhttp.open('GET', '/crash/' + culprit, true);
    xmlhttp.send();
  });
}

function start() {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText));
        } else if (xmlhttp.status == 400) {
          reject('400');
        } else {
          reject('unknown error');
        }
      }
    };

    xmlhttp.open('GET', '/start', true);
    xmlhttp.send();
  });
}

function resetVehicle() {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          resolve(JSON.parse(xmlhttp.responseText));
        } else if (xmlhttp.status == 400) {
          reject('400');
        } else {
          reject('unknown error');
        }
      }
    };

    xmlhttp.open('GET', '/reset', true);
    xmlhttp.send();
  });
}

function setStartPosition(pos) {
  moveBusEmoji(pos, [0, 0]);
}

function load() {
  start().then(res => {
    setState(res);
    updateEventLog();
    // updateState();
    setStartPosition([0, 0]);
    // console.log('state', this.state);
  });
}
