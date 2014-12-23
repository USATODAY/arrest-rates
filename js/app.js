var app = app || {};

app.selectedColor = "#FFFFFF";
app.fergusonRate = 2.818783292777652;

app.roundNumber = function(number) {
  return Math.round( number * 10) / 10;
};

app.init = function() {

  app.addVideoListeners();

  app.events = _.clone(Backbone.Events);
  

  app.events.on("newState", function(abbr, fullName) {
    Analytics.click("State viewed");
    $(".intro-wrap").hide();
    if (app.stateView) {
      if (app.stateView.state != "FL"){
        app.mapView.removeData();
      }
      
      app.stateView.remove();
      
    }

    
    app.stateView = new app.StateView({state: abbr, fullName: fullName});
  

    


  });
  app.events.on("goToState", function(data, highlightName) {
    if (highlightName) app.mapView.parseData(data, highlightName);
    else {
      app.mapView.parseData(data);
      app.mapView.centerMap();
    }
    
  });

  app.appView = new app.AppView();


  
};

app.StateModel = Backbone.Model.extend({});

app.StateCollection = Backbone.Collection.extend({
  initialize: function(props) {
    this.url = props.url;
    
  },
  model: app.StateModel,
  currentHighlight: null,
  filterSearch: function(term) {
    term = term.toLowerCase();
    var filtered = this.filter(function(model) {
      modelName = model.get("name").toLowerCase();
      return modelName.indexOf(term) > -1;
    });
    return filtered;
  },
  setHighlight: function(searchName) {

    var model = this.where({name: searchName})[0];


    $(".search-instructions").removeClass("show");
    this.currentHighlight = model;
    this.trigger("setHighlight");

    app.appView.highlight(this.currentHighlight);
  },
  setDepartment: function(name) {
    var model = this.where({name: name})[0];
    this.currentHighlight = model;
    this.trigger("setHighlight");

    app.appView.highlight(this.currentHighlight);
  }
});

app.AppView = Backbone.View.extend({
  el: "body",
  initialize: function() {

    app.mapView = new app.MapView();
    
    app.navView = new app.NavView();
  },
  events: {
    "click .state-nav-toggle": "showNav",
    "click .share-button": "showSharePage",
    "click .info-button": "showInfoPage",
    "click .share-close-button": "hideSharePage",
    "click .info-close-button": "hideInfoPage",
    "click .play-video": "showVideo",
    "click .video-button": "showVideo"
    
  },
  showNav: function() {
    app.events.trigger("showNav");
  },
  showShare: function() {
    $(".info-button").show();
    $(".article-button").show();
    $(".video-button").show();
    this.$el.find(".share-button").show();
  },
  shareTemplate: app.templates["SHAREVIEW.HTML"],
 
  renderShare: function(copy) {
    context = {
      copy: copy
    };
    var html = this.shareTemplate(context);
    $(".share-page").eq(0).html(html);

  },
  showSharePage: function() {
    this.renderShare(this.shareCopy);
    $(".share-page").eq(0).addClass("show");
     $(".page-wrap").addClass("blur");
  },
  hideSharePage: function() {
    $(".share-page").eq(0).removeClass("show");
     $(".page-wrap").removeClass("blur");
  },
  showInfoPage: function() {
    
    $(".info-page").eq(0).addClass("show");
     $(".page-wrap").addClass("blur");
  },
  hideInfoPage: function() {
    
    $(".info-page").eq(0).removeClass("show");
     $(".page-wrap").removeClass("blur");
  },
  shareCopy: "Review the black and white arrest rate disparity of more than 3,500 police departments.",
  setShareCopy: function(copyObj, detail) {
    var newCopy;
    if (detail) {
      newCopy = "The " + copyObj.name + " " + copyObj.compare + " Read more:";
    }
    else {
      newCopy = copyObj;
    }
    this.shareCopy = newCopy;
  },
  highlight: function(e) {

    var data = e.toJSON();
    var copyObj = {};

    var arrestRate = data.arr_rate_disproportion;
    if (arrestRate > app.fergusonRate) {
      copyObj.compare = "has a higher disparity of black arrests than Ferguson MO.";
    }
    else if (arrestRate > 1 & arrestRate <= app.fergusonRate) {
      copyObj.compare = "has a lower disparity of black arrests than Ferguson MO.";
    }
    else {
      copyObj.compare = "has no disparity of black arrests.";
    }

    copyObj.name = data.name;
    this.setShareCopy(copyObj, true);
  },
  showVideo: function() {
    Analytics.click("Video Button Clicked");
    $(".video-wrap").addClass("show");
    _.delay(app.videoPlayPause, 500, 0);
  }
});


app.MapView = Backbone.View.extend({
    el: "#map",
    events: {
      "click path": "clickPath"
    },
    initialize: function() {

      this.render();
    },
    parseData: function(data, highlightName) {

        
        var markers = [];
        var latlngarr = [];
        for (var i = 0; i < data.length; i++) {
            var lat = data[i].lat;
            var lng = data[i].lng;
           
            if (lat !== null & lng !== null) {

              var disp = data[i].arr_rate_disproportion;
              var color;

              if (disp > app.fergusonRate) color = "#33b8f2";
              else if (disp > 1) color = "#9dff03";
              else color = "#ff8b00";
              
              var node = {};
              node.type = "Feature";
              node.properties = {};
              node.properties.title = data[i].name;
              node.properties.description = "Disproportion " + data[i].arr_rate_disproportion;
              node.properties["marker-size"] = "small";
              //node.properties["marker-symbol"] = "restaurant", // optional, remove this line for no marker
              node.properties["marker-color"] = color;
              node.geometry = {
                "type": "Point",
                "coordinates": [data[i].lng, data[i].lat]
              };
              markers.push(node);
              latlngarr.push([data[i].lat, data[i].lng]);
            }

            
        }
       
        if (highlightName){
          this.addData(markers, highlightName);
        }
        else {
          this.addData(markers);
        }
        
        this.latlongs = latlngarr;
    },
    render: function() {
        L.mapbox.accessToken = 'pk.eyJ1IjoidXNhdG9kYXlncmFwaGljcyIsImEiOiJ0S3BGdndrIn0.5juF5LWz_GRcndian32tZA';
            // Create a map in the div #map
           app.map = L.mapbox.map('map', 'usatodaygraphics.darkmap', {
             zoomControl: false,
             maxZoom: 10,
             minZoom: 2,
             
           });
           var attrCtrl = app.map.attributionControl;


           app.map.setView([37.182202, -96.273194], 3);

         this.addArrests();
        

    },
    
    addData: function(data, highlightName) {
      var viewCoords = [];
      if (app.mapDataLayer) {
        this.removeData();
      }

      if (highlightName) {
        
        for (var i = 0; i < data.length; i++) {
          var properties = data[i].properties;

          if (properties.title == highlightName) {
            
            data[i].properties['old-color'] = data[i].properties['marker-color'];
            data[i].properties['marker-color'] = app.selectedColor;

            viewCoords = [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]];
          }
        }

      }

      app.mapDataLayer = L.mapbox.featureLayer(data).addTo(app.map);
      if (highlightName) {
        app.map.setView(viewCoords, 10);
      }
      resetColors = this.resetColors;

      app.mapDataLayer.on("click", function(e) {
        var name = e.layer.feature.properties.title;
        app.events.trigger("setDepartment", name);
      });
    },
    resetColors: function(data) {

      for (var i = 0; i < data.length; i++) {
        data[i].properties['marker-color'] = data[i].properties['old-color'] ||
        data[i].properties['marker-color'];
      }
      app.mapDataLayer.setGeoJSON(data);
    },
    removeData: function() {

      app.map.removeLayer(app.mapDataLayer);
    },
    addArrests: function() {
      app.arrestLayer = L.mapbox.tileLayer("usatodaygraphics.a8b8d561").addTo(app.map);
    },
    removeArrests: function() {
      app.map.removeLayer(app.arrestLayer);
    },
    centerMap: function() {
      app.map.fitBounds(this.latlongs, {padding: [50,50]});

    }
});

app.StateView = Backbone.View.extend({
  events: {
    "click .search-button": "renderResults",
    "click .search-entry": "selectEntry",
    "keyup .state-search": "renderResults",
    "click .selected-state-id": "showNav"

  },
  initialize: function(props) { 

    this.state = props.state;
    this.fullName = props.fullName;

    if (props.state == "FL") {
      //do florida stuff
      this.floridaRender();
    }
    else {
      this.collection = new app.StateCollection({url: this.stateUrl(props.state)});
      this.collection.fetch({reset: true});
      this.listenTo(this.collection, "reset", this.addMapMarkers);
      this.listenTo(this.collection, "reset", this.render);
      this.listenTo(this.collection, "setHighlight", this.showDetail);
      this.listenTo(app.events, "setDepartment", this.setDepartment);
    }
    
    app.appView.setShareCopy("Review the black and white arrest rate disparity of more than 3,500 police departments.", false);
  },
  template: app.templates["STATEVIEW.HTML"],
  resultsTemplate: app.templates["STATESEARCH.HTML"],
  className: "state-view",
  render: function() {
    
    var context = {name: this.state, fullname: this.fullName, models: this.collection.toJSON()};

    this.$el.html(this.template(context));
    this.$el.find(".state-search-results").append(this.resultsTemplate(context));
    $(".map-key").show();
    $(".share-button").show();
    $(".info-button").show();
    $(".article-button").show();
    $(".video-button").show();
    this.showView();

    return this;
  },
  floridaRender: function() {

    this.$el.html("<div class='selected-state-id right'>FL▼</div>" + "<h3 class='search-instructions show'>No Data Available for Florida</h3>");
    $(".share-button").show();
    $(".map-key").show();
    $(".info-button").show();
    $(".article-button").show();
    $(".video-button").show();
    this.showView();
    app.map.setView([28.063015, -83.805551], 6);
  },
  stateUrl: function(state) {
    var url = "js/data/states/" + state + ".json";
    return url;
  },
  addMapMarkers: function() {
    app.events.trigger("goToState", this.collection.toJSON());
    
  },
  showView: function() {
    $(".data-wrap").html(this.el);
  },
  renderResults: function() {
    if (app.detailView) app.detailView.remove();
    var searchTerm = $(".state-search").eq(0).val();
    var filteredCollection = new app.StateCollection(this.collection.filterSearch(searchTerm));
    var context = {models: filteredCollection.toJSON()};
    this.$el.find(".state-search-results").html(this.resultsTemplate(context));
    if (searchTerm !== "" && !this.$el.find(".state-search-results").hasClass("show")) this.showResults();
    else if (searchTerm === "") this.hideResults();
    // return this;
  },
  selectEntry: function(e) {
    var name = $(e.currentTarget).data().name;
    $(".state-search").eq(0).val(name);
    app.events.trigger("goToState", this.collection.toJSON(), name);
    this.collection.setHighlight(name);
  },
  setDepartment: function(name) {
    app.events.trigger("goToState", this.collection.toJSON(), name);
    this.collection.setHighlight(name);
  },
  showDetail: function() {
    if (app.detailView) app.detailView.remove();

    app.detailView = new app.DetailView({model: this.collection.currentHighlight});
  },
  showResults: function() {
    this.$el.find(".state-search-results").addClass("show");
    this.$el.find(".search-instructions").removeClass("show");
  },
  hideResults: function() {
    this.$el.find(".state-search-results").removeClass("show");
    this.$el.find(".search-instructions").addClass("show");
  },
  showNav: function() {
    app.events.trigger("showNav");
  }
});

app.DetailView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  events: {
    // "click .back-button": "back",
  },
  template: app.templates["DETAILVIEW.HTML"],
  className: "detail-wrap",
  render: function() {
    var context = this.model.toJSON();

    if (context.arr_rate_disproportion > app.fergusonRate) context.colorClass = "greater";
    else if (context.arr_rate_disproportion > 1 & context.arr_rate_disproportion <= app.fergusonRate) context.colorClass = "less";
    else context.colorClass = "none";
    context.b_arr_rate_rounded = app.roundNumber(context.b_arr_rate);
    context.nb_arr_rate_rounded = app.roundNumber(context.nb_arr_rate);
    this.$el.html(this.template(context));
    this.append();
    // this.drawChart(context);
    return this;
  },
  append: function() {
    $(".state-search-results").removeClass("show");
    $(".data-wrap").append(this.el);
  },
  back: function() {
    app.events.trigger("goToState", app.stateView.collection.toJSON());
    this.remove();
    $(".state-search").eq(0).val("");
    app.stateView.renderResults();
    // $(".state-search-results").addClass("show");
  }
});


app.NavModel = Backbone.Model.extend({});
app.NavCollection = Backbone.Collection.extend({
  model: app.NavModel,
  url: "js/data/state-list.json",
  comparator: 'full_name'
});

app.NavView = Backbone.View.extend({

  initialize: function() {
    this.collection = new app.NavCollection();
    this.collection.fetch({reset: true});
    this.listenTo(this.collection, "reset", this.render);
    this.listenTo(app.events, "showNav", this.show);
    this.listenTo(app.events, "hideNav", this.hide);
  },
  className: "state-nav",
  template: app.templates["STATENAV.HTML"],
  events: {
    "click .state-nav-close-button": "hide",
    "click .state-entry": "showState"
  },
  render: function() {
    var context = {states: this.collection.toJSON()};

    this.$el.html(this.template(context));
    $("body").append(this.el);
    return this;
  },
  show: function() {
    this.$el.addClass("show");
    $(".page-wrap").addClass("blur");
  },
  hide: function() {
    this.$el.removeClass("show");
    $(".page-wrap").removeClass("blur");
  },
  showState: function(e) {
    $(".page-wrap").removeClass("full-screen");
    app.map.invalidateSize();
    var abbr = $(e.currentTarget).data().abbr;
    var fullName = $(e.currentTarget).text();
    app.events.trigger("newState", abbr, fullName);
    this.hide();
  }
});

app.videoPlayPause = function(intVideo) {
  if (app.arrVideos[intVideo].paused) {
    Analytics.click("played video");
    app.arrVideos[intVideo].volume = 0.6;
    app.arrVideos[intVideo].play();

    
  } else {
      app.arrVideos[intVideo].pause();
    
  } 
};

  

  app.addVideoListeners = function() {

    //video elements
    app.arrVideos = jQuery("video");
    app.videoPlayButton = jQuery("#play-pause");

    //video container
    app.videoContainer = jQuery(".video-wrap");
    // Controls
    app.videoControls = jQuery("#video-controls");

    //Fallback video controls
    app.touchVideoControls = jQuery(".touch-video-controls");
    app.videoPlayFallback = jQuery("#video-play-fallback");
    app.videoCloseButton = jQuery(".video-close-button");

    // Buttons
    app.playButton = jQuery("#play-pause");

    // Sliders
    app.videoSeekBar = jQuery("#seek-bar");
    app.videoSeekDot = jQuery("#video-dot");
    app.chapterHead = jQuery("#chapter-header");
    app.descriptionHead = jQuery("#description-header");

    // Event listener for the play/pause button
    app.videoPlayButton.on("click", function() {
      if (app.arrVideos[0].paused === true) {
        // Play the video
        app.arrVideos[0].play();

      } else {
        // Pause the video
       app.arrVideos[0].pause();

      }
    });

    //enable seeking with control dot
    app.videoSeekDot.draggable({ 
      containment: "parent",
      axis: "x",
      stop: function( event, ui ) {
        dotWidth = app.videoSeekDot.outerWidth();
        range = app.videoSeekBar.outerWidth() - dotWidth;
        position = ui.position.left;
        currentPercent = position / range;
        newTime = currentPercent * app.arrVideos[0].duration;
        app.arrVideos[0].currentTime = newTime;
      }
    });

    //updates position of video control dot
    app.arrVideos[0].addEventListener("timeupdate", function(e) {
      dotWidth = app.videoSeekDot.outerWidth();
      range = app.videoSeekBar.outerWidth() - dotWidth;
      currentProgress = app.arrVideos[0].currentTime / app.arrVideos[0].duration;
      newPosition = range * currentProgress;
      app.videoSeekDot.css("left", newPosition + "px");
    });

    app.videoSeekBar.on("click", function(e) {
      var newPosition = 0;
      if (e.offsetX !== undefined) {
        newPosition = e.offsetX;
      }
      else {
        newPosition = e.originalEvent.layerX;
      }

      range = app.videoSeekBar.outerWidth() - dotWidth;
      newPercent = newPosition/range;
      newTime = newPercent * app.arrVideos[0].duration;
      app.arrVideos[0].currentTime = newTime;
    });

    //keep the controls updated to whether or not video is playing
    app.arrVideos[0].addEventListener("playing", function(e) {
      app.videoPlayButton.addClass("pause");
      app.videoPlayButton.removeClass("play");
    });

    app.arrVideos[0].addEventListener("pause", function(e) {
      app.videoPlayButton.removeClass("pause");
      app.videoPlayButton.addClass("play");
    });

     app.arrVideos[0].addEventListener("ended", function(e) {
      app.videoContainer.removeClass("show");
     });

   app.videoContainer.on("mouseover", function(e) {
      app.videoControls.fadeIn();
    });

   app.videoContainer.on("mouseleave", function(e) {
      app.videoControls.fadeOut();
    });

   app.videoCloseButton.click(function(e) {
     app.arrVideos[0].pause();
     app.videoContainer.removeClass("show");
   });
};




$(document).ready(function() {
 
  app.init();

  (function() {
      var width = $(window).width();
      if(Modernizr.touch && width < 700) {
        $("#header").height(50);
      }
    })();

});
