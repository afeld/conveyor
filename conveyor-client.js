/*
  Conveyor - client library
  by Aidan Feldman
*/
/*jshint browser:true */
/*global console:true */
window.Conveyor = {
  get: function(opts){
    if (!opts.url){
      throw new Error('requires a URL');
    }

    var offset = 0;

    var xhr = new XMLHttpRequest(); // $.ajaxSetup().xhr();
    xhr.multipart = true;
    xhr.open('GET', opts.url, true);

    // only available in IE 7+ - http://msdn.microsoft.com/en-us/library/ie/dd576252(v=vs.85).aspx
    xhr.onreadystatechange = function(){
      switch (xhr.readyState){
        case 3: // LOADING
          console.log(xhr.responseText);
          break;
        case 4: // DONE
          if (opts.done){
            opts.done.call(opts.scope || this);
          }
          break;
      }
    };
    xhr.send(null);
  }
};
