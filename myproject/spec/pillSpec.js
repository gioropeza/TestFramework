describe("Pill", function() {

  var Pill = require('../lib/pill');

  it("should be red", function() {
    expect(Pill.pill("red")).toBe("red");
  });

  it("should be blue", function(){
    expect(Pill.pill("blue")).toBe("blue");
  });

  it("should be null", function () {
    expect(Pill.pill()).toBe(null);
  });
});