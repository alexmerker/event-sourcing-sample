'use strict';

var http = require('http'),
  open = require('open'),
  express = require('express'),
  app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.listen(5000, function() {
  console.log('Server running on http://localhost:5000');
  console.log('Launching the browser!');
  open('http://localhost:5000');
});
