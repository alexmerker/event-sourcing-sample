"use strict"

var express = require('express');
var app = express();

var Eventstore = require('./eventstore');
var eventstore = new Eventstore();

var Vehicle = require('./vehicle');
var vehicle = new Vehicle(eventstore, [0,0]);

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.get('/move/:direction', (req,res) => {
    let direction = JSON.parse(req.params.direction)
    vehicle.move(direction)
    res.send("Drivin along");
});

app.get('/get-events', (req, res) => {
    res.send(eventstore.getstore());
});

app.listen(13377);