/*jshint browser:true*/
/*global describe, it, expect, Conveyor */
describe('Conveyor client', function(){
  it("should call 'done'", function(done){
    Conveyor.get({
      url: '/count?n=3',
      done: done
    });
  });
});
