var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var app = app || {};

MapView = Backbone.View.extend({
    el: "#map",
    events: {
      "click path": "clickPath"
    },
    initialize: function() {
    },
    parseData: function(data) {

        
        var markers = [];
       
        for (var i = 0; i < data.length; i++) {
            var node = {};
            node.type = "Feature";
            node.properties = {};
            node.properties.title = data[i].name;
            node.properties.description = "Disproportion " + data[i].arr_rate_disproportion;
            node.properties["marker-size"] = "small";
            //node.properties["marker-symbol"] = "restaurant", // optional, remove this line for no marker
            node.properties["marker-color"] = "#990000";
            node.geometry = {
              "type": "Point",
              "coordinates": [data[i].lng, data[i].lat]
            };
            markers.push(node);
        }
        this.addData(markers);
    },
    render: function() {
        L.mapbox.accessToken = 'pk.eyJ1IjoidXNhdG9kYXlncmFwaGljcyIsImEiOiJ0S3BGdndrIn0.5juF5LWz_GRcndian32tZA';
            // Create a map in the div #map
           app.map = L.mapbox.map('map', 'usatodaygraphics.basemap');
           app.map.setView([37.182202, -96.273194], 3);

          // var featureLayer = omnivore.topojson('js/data/us.json').addTo(app.map);

         this.addArrests();
        

    },
    addData: function(data) {
      
      app.mapDataLayer = L.mapbox.featureLayer(data).addTo(app.map);
    },
    removeData: function() {
      app.map.removeLayer(app.mapDataLayer);
    },
    addArrests: function() {
      app.arrestLayer = L.mapbox.tileLayer("usatodaygraphics.s6kr19k9").addTo(app.map);
    },
    removeArrests: function() {
      app.map.removeLayer(app.arrestLayer);
    },
    clickPath: function() {
      console.log(this);
    }
});

module.exports = MapView;