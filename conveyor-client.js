/*
  Conveyor - client library
  by Aidan Feldman
*/
/*jshint browser:true */
(function(){
  var Conveyor = function(opts){
    var url = opts.url;
    if (!url){
      throw new Error('requires a URL');
    }

    this.url = url;
    this.chunkCb = opts.chunk;
    this.doneCb = opts.done;
    this.scope = opts.scope || window;
    this.offset = 0;

    var xhr = new XMLHttpRequest(); // $.ajaxSetup().xhr();
    this.xhr = xhr;

    xhr.multipart = true;
    xhr.open('GET', url, true);

    var self = this;
    // only available in IE 7+ - http://msdn.microsoft.com/en-us/library/ie/dd576252(v=vs.85).aspx
    xhr.onreadystatechange = function(){
      self._onStateChange();
    };

    xhr.send(null);
  };

  Conveyor.prototype._onStateChange = function(){
    switch (this.xhr.readyState){
      case 3: // LOADING
        this._onChunk();
        break;
      case 4: // DONE
        this._onDone();
        break;
    }
  };

  Conveyor.prototype._onChunk = function(){
    var fullText = this.xhr.responseText,
      newLength = fullText.length,
      chunk = fullText.slice(this.offset);

    // remove leading/trailing Array brackets and commas
    // TODO allow arrays to be sent
    chunk = chunk.replace(/^\s*(\[|,)?\s*/, '').replace(/\s*(,|\])?\s*$/, '');

    if (chunk && this.chunkCb){
      var obj = JSON.parse(chunk);
      this.chunkCb.call(this.scope, obj);
    }

    this.offset = newLength;
  };

  Conveyor.prototype._onDone = function(){
    if (this.doneCb){
      this.doneCb.call(this.scope);
    }
  };


  // primary public method
  Conveyor.get = function(opts){
    new Conveyor(opts);
  };


  window.Conveyor = Conveyor;
}());
