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
    i++;
    if (i <= count){
      conveyor.write(i);
    } else {
      conveyor.end();
    }
  }, 10);
});


if (require.main === module){
  // run directly
  // open http://localhost:8000/test/index.html
  app.use(express['static'](__dirname + '/../'));
}

app.listen(8000);
console.log('Server running at http://127.0.0.1:8000');
