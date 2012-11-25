/*jshint node:true */
'use strict';

var express = require('express'),
  Conveyor = require('../lib/conveyor');


var app = express();

app.get('/count', function(req, res){
  var count = req.query.n,
    conveyor = new Conveyor(res),
    i = 0;

  var interval = setInterval(function(){
    if (i < count){
      conveyor.write({i: i});
    } else {
      conveyor.end();
    }

    i++;
  }, 100);
});

app.listen(8000);
console.log('Server running at http://127.0.0.1:8000/');
