"use strict"

var express = require('express');
var app = express();

var Eventstore = require('./eventstore');
var eventstore = new Eventstore();

var Vehicle = require('./vehicle');
var vehicle = new Vehicle(eventstore);

app.get('/', function(req, res){
   res.send("Hello world!");
});

//PARAM: sourcefield = [0,1]
app.get('/left/:sourcefield', (req, res) => {
    let sourcefield = JSON.parse(req.params.sourcefield)
    vehicle.left(sourcefield);
    res.send("Driver! LEFT!");
});

app.get('/right/:sourcefield', (req, res) => {
    let sourcefield = JSON.parse(req.params.sourcefield)
    vehicle.right(sourcefield);
    res.send("Driver! RIGHT!");
});

app.get('/up/:sourcefield', (req, res) => {
    let sourcefield = JSON.parse(req.params.sourcefield)
    vehicle.up(sourcefield);
    res.send("Driver! UP!");
});

app.get('/down/:sourcefield', (req, res) => {
    let sourcefield = JSON.parse(req.params.sourcefield)
    vehicle.down(sourcefield);
    res.send("Driver! DOWN!");
});

app.get('/get-events', (req, res) => {
    res.send(eventstore.getstore());
});

app.listen(13377);