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

function move(coords) {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        // XMLHttpRequest.DONE == 4
        if (xmlhttp.status == 200) {
          resolve(xmlhttp.responseText);
        } else if (xmlhttp.status == 400) {
          reject('400');
        } else {
          reject('unknown error');
        }
      }
    };

    xmlhttp.open('GET', '/move/' + JSON.stringify(coords), true);
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
          resolve(xmlhttp.responseText);
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

function load() {
  move([1, 0]).then(res => console.log(res));
  crash('zombie').then(res => console.log(res));
  getState().then(res => console.log(res));
  getEvents().then(res => console.log(res));
}
