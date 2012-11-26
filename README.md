# Conveyor

![Conveyor belt](http://afeld.github.com/conveyor/belt-conveyor.png)

A NodeJS module and small [browser library](https://github.com/afeld/conveyor/blob/master/conveyor-client.js) for streaming JSON responses via AJAX.  Uses long-lived requests to allow for incremental responses from your server, all in the comfort of REST.

## Example

Suppose you have a search box with typeahead, where the results can come from multiple sources.  You want to return the results to the client as quickly as possible.  With non-streaming responses, you'd need to wait until *all* subsequent requests finish before you could send anything back to the client.

```javascript
// browser
$.ajax({
  url: '/api/search?q=beans',
  success: function(data){
    // only called after *all* data is received
  }
});


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


// response (all at once)

// 1. wait
// ...
// 2. when both db1 AND db2 are done:
[
  { /* db1 obj */ },
  { /* db2 obj */ }
]
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
        // send immediately
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


// response

// 1. immediately:
[
// 2. as soon as db2 responds:
  { /* db2 obj */ }
// 3. as soon as db1 responds:
  ,{ /* db1 obj */ }
// 4. on end():
]
```

## Server Usage

### new Conveyor(response)

Create a new Conveyor responder.

* `response` {http.ServerResponse} (required)

### conveyor.write(obj)

Send JSON object to the client.

* `obj` {Mixed} (required) - Any object type that can be serialized via `JSON.stringify()`.

### conveyor.end()

Call when server is done sending data the client.

## Client Usage

Compatible with IE 7+ and all modern browsers.

### Conveyor.get(options)

Create a new streaming JSON request, where `options` is an `Object` with the following properties:

* `url` {String} (required) Streaming JSON endpoint.
* `chunk` {Function} - Callback that's fired for every object sent by the server.
* `done` {Function} - Callback that's fired when the request is complete, successfully or not.
* `scope` {Object} - The context in which to execute the callbacks.

### new Conveyor(options)

Alternative way to initiate a request - same `options` as above.

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
