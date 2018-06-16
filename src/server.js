'use strict';

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var Eventstore = require('./eventstore');
var eventstore = new Eventstore();

var Vehicle = require('./vehicle');
var vehicle = new Vehicle(eventstore, [0, 0]);

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.get('/move/:direction', (req, res) => {
  let direction = JSON.parse(req.params.direction);
  vehicle.move(direction);
  res.send('Drivin along');
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
  res.send('Oh noes');
});

app.listen(13377);
