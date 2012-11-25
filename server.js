var http = require('http'),
  Streamer = require('./json_streamer');


http.createServer(function(req, res){
  var streamer = new Streamer(res);

  var numSent = 0;
  var interval = setInterval(function(){
    if (numSent >= 10){
      streamer.end();
      clearInterval(interval);
    } else {
      var time = new Date();
      streamer.write({time: time.toString()});
      numSent++;
    }
  }, 1000);
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
