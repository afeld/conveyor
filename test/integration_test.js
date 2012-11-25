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
});
