/*
  Conveyor - client library
  by Aidan Feldman
*/
/*jshint browser:true */
/*global console:true */
window.Conveyor = function(url){
  if (!url){
    throw new Error('requires a URL');
  }

  this.url = url;
  this.offset = 0;

  var xhr = new XMLHttpRequest(); // $.ajaxSetup().xhr();
  this.xhr = xhr;

  xhr.multipart = true;
  xhr.open('GET', url, true);

  // bind context
  var self = this;
  xhr.onreadystatechange = function(){
    self._onChunk();
  };
  xhr.send(null);
};

window.Conveyor.prototype._onChunk = function(){
  var xhr = this.xhr;
  switch (xhr.readyState){
    case xhr.LOADING: // 3
      console.log(xhr.responseText);
      break;
    case xhr.DONE: // 4
      // nada
      break;
  }
};
