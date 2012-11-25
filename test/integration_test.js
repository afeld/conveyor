/*jshint browser:true*/
/*global describe, it, expect, Conveyor */
describe('Conveyor client', function(){
  var origin = 'http://localhost:8001';

  it("should call 'done'", function(done){
    Conveyor.get({
      url: origin + '/count?n=1',
      done: done
    });
  });

  it("should call 'chunk' for each object sent", function(done){
    var n = 0;
    Conveyor.get({
      url: origin + '/count?n=2',
      chunk: function(obj){
        expect(obj).to.be(n);
        n++;
      },
      done: function(){
        expect(n).to.be(2);
        done();
      }
    });
  });
});
