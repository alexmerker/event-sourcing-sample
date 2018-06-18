'use strict';

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var Eventstore = require('./eventstore');
var eventstore = new Eventstore();

var ReplayService = require('./replayservice');
var replayService = new ReplayService(eventstore);

var Vehicle = require('./vehicle');
var vehicle = new Vehicle(eventstore, [0, 0]);


app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.get('/start', (req, res) => {
  vehicle.start([0, 0]);
  res.send(vehicle.get_state());
});

app.get('/move/:position/:direction', (req, res) => {
  let direction = JSON.parse(req.params.direction);
  let position = JSON.parse(req.params.position);
  vehicle.move(position, direction);
  res.send(vehicle.get_state());
});

app.get('/get-events', (req, res) => {
  res.send(eventstore.getstore());
});

app.get('/get-state', (req, res) => {
  res.send(vehicle.get_state());
});

app.get('/crash/:culprit', (req, res) => {
  let culprit = req.params.culprit;
  vehicle.crash(culprit);
  res.send(vehicle.get_state());
});

app.get('/replayState', (req, res) => {

  replayService.replay().then((response) => {
      res.send(response);
  }).catch((err) => {
    res.send(err);
  })
});

app.get('/replayState/:time', (req, res) => {

    replayService.replay(req.params.time).then((response) => {
        res.send(response);
    }).catch((err) => {
      res.send(err);
    })
});
app.get('/reset', (req, res) => {
  vehicle.reset();
  res.send(vehicle.get_state());
});

// app.get('/replay', (req, res) => {
//   vehicle.replay() eventstore.
//   res.send(vehicle.get_state());
// });

app.listen(13377);
