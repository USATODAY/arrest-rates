module.exports = function() {
  var width = 960,
    height = 500;
var projection = d3.geo.albers().scale(1000);
  var path = d3.geo.path()
    .projection(projection)
    .pointRadius(0.1);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

queue()
    .defer(d3.json, "js/data/us.json")
    .defer(d3.json, "js/data/test2.json")
    .await(ready);

function ready(error, us, points) {
  console.log(topojson.feature(us, us.objects.states).features);
  g.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  var states = g
      .datum(topojson.feature(us, us.objects.states).features)
    .append("path")
    .attr("class", "state")
      .attr("d", path);

  g.selectAll(".symbol")
      .data(topojson.feature(points, points.objects.output).features)
    .enter().append("path")
      .attr("class", function(d,i) {
        var result = "points ";
        var disp = d.properties.disproportion;
        if (disp < 2) result += "low";
        else if (disp > 2 & disp < 4) result += "low-medium";
        else if (disp >= 4 & disp < 8) result += "high-medium";
        else if (disp >= 8) result += "high"; 
        
        return result;
      })
      .attr("d", path.pointRadius(2));

  states.on("click", function(){
    d3Selection = d3.select(this);
  // console.log(d3Selection.datum());
  // drawState(d3Selection.datum());
});
}

// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 
 
  });
 
// svg.call(zoom);

function drawState(datum) {
  
  // console.log(topojson.feature(datum));
    height = 500;
var projection = d3.geo.albers().scale(800);
  var path = d3.geo.path()
    .projection(projection)
    .pointRadius(0.1);

var svg = d3.select(".page-wrap").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

g.append("path")
      .datum(datum)
      .attr("class", "land")
      .attr("d", path);
  
  }
};