/*jshint browser:true*/
/*global describe, it, expect, Conveyor */
(function(){
  var origin = 'http://localhost:8000';

  describe('`done` callback', function(){
    it("should be called after success", function(done){
      Conveyor.get({
        url: origin + '/count?n=1',
        done: done
      });
    });
  });

  describe('`chunk` callback', function(){
    it("should be called for each object sent", function(done){
      var n = 0;
      Conveyor.get({
        url: origin + '/count?n=2',
        chunk: function(obj){
          n++;
          expect(obj).to.be(n);
        },
        done: function(){
          expect(n).to.be(2);
          done();
        }
      });
    });
  });

  describe('.abort()', function(){
    it("should prevent further `chunk` events", function(done){
      var n = 0;
      var conveyor = Conveyor.get({
        url: origin + '/count?n=2',
        chunk: function(obj){
          n++;
          conveyor.abort();
        },
        done: function(){
          expect(n).to.be(1);
          done();
        }
      });
    });

    it("should always fire a `done` event", function(done){
      var conveyor = Conveyor.get({
        url: origin + '/count?n=2',
        done: done
      });

      conveyor.abort();
    });
  });
}());
