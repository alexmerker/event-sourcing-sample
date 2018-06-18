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
  //Cleanup eventstore
  eventstore.setstore([]);
  eventstore.reset_timer();

  vehicle.reset();
  vehicle.start([0, 0]);
  res.send(vehicle.get_state());
});

app.get('/move/:direction', (req, res) => {
  let direction = JSON.parse(req.params.direction);
  vehicle.move(direction);
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

app.get('/reset', (req, res) => {
  vehicle.reset();
  res.send(vehicle.get_state());
});

app.get('/replayState', (req, res) => {
  replayService
    .replay()
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.send(err);
    });
});

app.get('/replayState/:time', (req, res) => {
  replayService
    .replay(req.params.time)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(13377);
