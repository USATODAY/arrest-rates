describe("App", function() {
  it("should be defined", function() {
    expect(app).toBeDefined();
  });
  it("should have Backbone available", function() {
    expect(Backbone).toBeDefined();
  });
  it("should have Underscore available", function() {
    expect(_).toBeDefined();
  });
});

describe("Views", function() {
  it("should have a MapView view", function() {
    expect(app.MapView).toBeDefined();
    expect(app.MapView.render).toBeDefined();
  });
})
