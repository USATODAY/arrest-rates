this["app"] = this["app"] || {};
this["app"]["templates"] = this["app"]["templates"] || {};

this["app"]["templates"]["DETAILVIEW.HTML"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h1 class="detail-header">' +
((__t = ( name )) == null ? '' : __t) +
'</h1>\n<p class="chart-info">2011-12 ARREST RATE PER 1000 RESIDENTS</p>\n\n<div class="detail-numbers ' +
((__t = ( colorClass )) == null ? '' : __t) +
'">\n  <div class="detail-1 detail-container">\n    <h3 class="black-rate">' +
((__t = ( b_arr_rate_rounded )) == null ? '' : __t) +
'</h3>\n    <p class="rate-sub">Black Rate</p>\n  </div>\n  <div class="detail-2 detail-container">\n    <h3 class="white-rate">' +
((__t = ( nb_arr_rate_rounded )) == null ? '' : __t) +
'</h3>\n    <p class="rate-sub">Non-black Rate</p>\n  </div>\n</div>\n';

}
return __p
};

this["app"]["templates"]["SHAREVIEW.HTML"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="share-close-button"><img src="img/close.svg" alt="close" class="close-icon"></div>\n<h2 class="share-title">Share</h2>\n<p class="share-copy">' +
((__t = ( copy )) == null ? '' : __t) +
'</p>\n';
 
  var encodedURL = encodeURIComponent("http://bit.ly/1qifaRE");
  var encodedURL2 = encodeURI("http://bit.ly/1qifaRE");
  var encodedStr = encodeURIComponent(copy);
  var encodedTitle = encodeURIComponent("Arrests");
  var encodedQuestion = encodeURIComponent("");
  var fbRedirectUrl = encodeURIComponent("http://www.gannett-cdn.com/usatoday/_common/_dialogs/fb-share-done.html");

  var tweetUrl = "https://twitter.com/intent/tweet?url=" + encodedURL + "&text=" + encodedStr + ""; 

  var fbUrl = "javascript: var sTop=window.screen.height/2-(218);var sLeft=window.screen.width/2-(313);window.open('https://www.facebook.com/dialog/feed?display=popup&app_id=215046668549694&link=" + encodedURL2 + "&picture=http://www.gannett-cdn.com/experiments/usatoday/2014/11/arrests-interactive/img/fb-post.jpg&name=" + encodedTitle +"&description="+ copy + "&redirect_uri=http://www.gannett-cdn.com/experiments/usatoday/_common/_dialogs/fb-share-done.html','sharer','toolbar=0,status=0,width=580,height=400,top='+sTop+',left='+sLeft);Analytics.click('Facebook share');void(0);";

  var emailURL = "mailto:?body=" + encodedStr +  "%0d%0d" + encodedURL +"&subject=" + encodedTitle;
      ;
__p += '\n    \n<a href="' +
((__t = ( tweetUrl )) == null ? '' : __t) +
'" onclick="Analytics.click(\'Twitter Share\')" class=\'social-link\' id=\'twitter-share\'> <img src=\'img/twitter.svg\' alt="twitter" class="social-icon"></a>\n<a href="' +
((__t = ( fbUrl )) == null ? '' : __t) +
'" onclick="Analytics.click(\'Facebook Share\')"><img src=\'img/fb.svg\' alt="twitter" class="social-icon"></a>\n<a href="' +
((__t = ( emailURL )) == null ? '' : __t) +
'" onclick="Analytics.click(\'Email Share\')" class="social-link" id="email-share"><img src="img/email.svg" alt="email" class="social-icon">\n  </a>';

}
return __p
};

this["app"]["templates"]["STATENAV.HTML"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="state-nav-close-button"><img src="img/close.svg" alt="close" class="close-icon"></div>\n<h2 class="nav-header">Select State: </h2>\n<ul class="state-nav-list">\n';
 _.each(states, function(state) { ;
__p += '\n<li class="state-entry" data-abbr ="' +
((__t = ( state.abbr )) == null ? '' : __t) +
'">' +
((__t = ( state.full_name )) == null ? '' : __t) +
'</li>\n\n';
 }); ;
__p += '\n</ul>';

}
return __p
};

this["app"]["templates"]["STATESEARCH.HTML"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n';
 _.each(models, function(model) { ;
__p += '\n<div class="search-entry" data-name="' +
((__t = ( model.name )) == null ? '' : __t) +
'">\n  <h4>' +
((__t = ( model.name )) == null ? '' : __t) +
' </h4>\n</div>\n\n';
 }); ;
__p += '\n';

}
return __p
};

this["app"]["templates"]["STATEVIEW.HTML"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="top-data-nav">\n  <input type="text" class="state-search" placeholder="Search for your police department"></input>\n\n  <div class="selected-state-id">' +
((__t = ( name )) == null ? '' : __t) +
'▼</div>\n  <div class="state-search-results"></div>\n</div>\n<div class="search-instructions show">Use the search box above to find a POLICE DEPARTMENT in ' +
((__t = ( fullname )) == null ? '' : __t) +
'.</div>\n';

}
return __p
};