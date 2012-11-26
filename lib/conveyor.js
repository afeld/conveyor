/*jshint node:true */
'use strict';

var newLine = '\r\n';

var Conveyor = function(res){
  if (!res){
    throw new Error('`res` must be passed to Conveyor');
  }

  this.res = res;
  this.objSent = false;

  res.writeHead(200, {'Content-Type': 'application/json'});

  res.write('[' + newLine);
};

Conveyor.prototype.write = function(obj){
  var chunk = JSON.stringify(obj) + newLine;
  if (this.objSent){
    // prepend comma
    chunk = ',' + chunk;
  }

  this.res.write(chunk);

  this.objSent = true;
};

Conveyor.prototype.end = function(){
  this.res.end(']');
};


module.exports = Conveyor;
