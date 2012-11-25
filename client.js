// thanks to:
//   http://www.ibm.com/developerworks/web/library/wa-reverseajax1/index.html
//   https://github.com/maxogden/streaming-xhr-example/blob/master/attachments/streaming-xhr.js
JSONStreamee = function(url){
  if (!url){
    throw new Error('requires a URL');
  }

  this.url = url;
  this.offset = 0;

  var xhr = $.ajaxSetup().xhr(); // new XMLHttpRequest();
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

JSONStreamee.prototype._onChunk = function(){
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


(function(){
  // url = 'http://localhost:8000/?' + Date.now(); // bypass cache

  var stream = new JSONStreamee('http://localhost:8000');
}());
