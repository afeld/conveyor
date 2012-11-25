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
      conveyor.write(i);
    } else {
      conveyor.end();
    }

    i++;
  }, 100);
});


var port;
if (require.main === module){
  // run directly
  // open http://localhost:8000/test/index.html
  app.use(express['static'](__dirname + '/../'));
  port = 8000;
} else {
  port = 8001;
}

app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);
