# Conveyor [![Build Status](https://secure.travis-ci.org/afeld/conveyor.png?branch=master)](https://travis-ci.org/afeld/conveyor)

![Conveyor belt](http://afeld.github.com/conveyor/belt-conveyor.png)

A NodeJS module and small [browser library](https://github.com/afeld/conveyor/blob/master/conveyor-client.js) for streaming JSON responses via AJAX.

Suppose you have a search box with typeahead, where the results can come from multiple sources.  You want to return the results to the client as quickly as possible.  With non-streaming responses, you'd need to wait until *all* subsequent requests finish before you could send anything back to the client.

```javascript
// browser
$.get('/api/search?q=beans', function(data){ ... });


// server
app.get('/api/search', function(req, res){
  var term = req.query.q;

  async.parallel([
    function(callback){
      db1.find(term, function(err, data){
        // assuming `data` is a JSON object
        callback(err, data);
      });
    },
    function(callback){
      db2.find(term, function(err, data){
        callback(err, data);
      });
    }
  ], function(err, results){
    // nothing sent until here
    res.json(results);
  });
});
```

Now, modified to use Conveyor:

```javascript
// browser
Conveyor.get({
  url: '/api/search?q=beans',
  chunk: function(obj){
    // called for each object sent in the JSON Array response
  }
});


// server
var Conveyor = require('conveyor');

app.get('/api/search', function(req, res){
  var term = req.query.q,
    // initialize the responder
    conveyor = new Conveyor(res);

  async.parallel([
    function(callback){
      db1.find(term, function(err, data){
        // sent immediately
        conveyor.write(data);
        callback(err);
      });
    },
    function(callback){
      db2.find(term, function(err, data){
        conveyor.write(data);
        callback(err);
      });
    }
  ], function(err){
    // just need to let it know we're done
    conveyor.end();
  });
});
```

## Server Usage

### new Conveyor(response)

Create a new Conveyor responder.  Requires Node `http.ServerResponse` to be passed to the constructor.

### conveyor.write(obj)

Send JSON object to the client.

### conveyor.end()

Call when server is done sending data the client.

## Client Usage

Compatible with IE 7+ and all modern browsers.

### Conveyor.get(options)

Create a new streaming JSON request, where `options` is an `Object` with the following properties:

* {String} `url` (required) Streaming JSON endpoint.
* {Function} `chunk` - Callback that's fired for every object sent by the server.
* {Function} `done` - Callback that's fired when the request is complete, successfully or not.
* {Object} `scope` - The context in which to execute the callbacks.

### conveyor.abort()

Terminate the request.  The `done` callback will be fired immediately, but `chunk` no longer will.

## Why not WebSockets?

* WebSockets are great for bi-directional communication like chat or multiplayer games, but they lack the clarity of REST.  If the example above were done via WebSockets, it would require extra care on the client to determine which search results belong to which queries.
* Conveyor is normal JSON over normal REST, so your API can be consumed by any HTTP client, backwards-compatible.
* WebSocket client libraries add lots of bulk to provide all the fallbacks... Socket.IO is ~45kb, plus ~176kb for the Flash transport.  The Conveyor client compresses to ~1.2kb.

## Reference

* http://www.ibm.com/developerworks/web/library/wa-reverseajax1/index.html
* https://github.com/maxogden/streaming-xhr-example/blob/master/attachments/streaming-xhr.js
* http://bugs.jquery.com/ticket/9883
