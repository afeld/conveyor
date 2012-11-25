/*jshint browser:true*/
/*global describe, it, expect, Conveyor */
describe('Conveyor client', function(){
  var origin = 'http://localhost:8000';

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
