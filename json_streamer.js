var JSONStreamer = function(res){
  if (!res){
    throw new Error('`res` must be passed to JSONStreamer');
  }

  this.res = res;
  this.objSent = false;

  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });

  res.write('[');
};

JSONStreamer.prototype.write = function(obj){
  var chunk = JSON.stringify(obj);
  if (this.objSent){
    // prepend comma
    chunk = ',' + chunk + '\r\n';
  }
  
  var written = this.res.write(chunk);
  if (!written){
    this.end();
  }

  this.objSent = true;
};

JSONStreamer.prototype.end = function(){
  this.res.end(']');
};


module.exports = JSONStreamer;
