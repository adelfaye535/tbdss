
var styles = [[{
  url: 'images/people35.png',
  height: 35,
  width: 35,
  anchor: [16, 0],
  textColor: '#ff00ff',
  textSize: 10
}, {
  url: 'images/people45.png',
  height: 45,
  width: 45,
  anchor: [24, 0],
  textColor: '#ff0000',
  textSize: 11
}, {
  url: 'images/people55.png',
  height: 55,
  width: 55,
  anchor: [32, 0],
  textColor: '#ffffff',
  textSize: 12
}], [{
  url: 'images/conv30.png',
  height: 27,
  width: 30,
  anchor: [3, 0],
  textColor: '#ff00ff',
  textSize: 10
}, {
  url: 'images/conv40.png',
  height: 36,
  width: 40,
  anchor: [6, 0],
  textColor: '#ff0000',
  textSize: 11
}, {
  url: 'images/conv50.png',
  width: 50,
  height: 45,
  anchor: [8, 0],
  textSize: 12
}], [{
  url: 'images/heart30.png',
  height: 26,
  width: 30,
  anchor: [4, 0],
  textColor: '#ff00ff',
  textSize: 10
}, {
  url: 'images/heart40.png',
  height: 35,
  width: 40,
  anchor: [8, 0],
  textColor: '#ff0000',
  textSize: 11
}, {
  url: 'images/heart50.png',
  width: 50,
  height: 44,
  anchor: [12, 0],
  textSize: 12
}]];

var markerClusterer = null;
var map = null;
var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' +
    'chco=FFFFFF,008CFF,000000&ext=.png';

function refreshMap() {
  if (markerClusterer) {
    markerClusterer.clearMarkers();
  }

  var markers = [];

  var markerImage = new google.maps.MarkerImage(imageUrl,
    new google.maps.Size(24, 32));

  for (var i = 0; i < 1000; ++i) {
    var latLng = new google.maps.LatLng(tweets.latitude, tweets.longitude)
    var marker = new google.maps.Marker({
      position: latLng,
      draggable: true,
      icon: markerImage
    });
    markers.push(marker);
  }

  var zoom = parseInt(document.getElementById('zoom').value, 10);
  var size = parseInt(document.getElementById('size').value, 10);
  var style = parseInt(document.getElementById('style').value, 10);
  zoom = zoom === -1 ? null : zoom;
  size = size === -1 ? null : size;
  style = style === -1 ? null: style;

  markerClusterer = new MarkerClusterer(map, markers, {
    maxZoom: zoom,
    gridSize: size,
    styles: styles[style]
    imagePath: '../images/m'
  });
}

function initialize() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: new google.maps.LatLng(13,122),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  var refresh = document.getElementById('refresh');
  google.maps.event.addDomListener(refresh, 'click', refreshMap);

  var clear = document.getElementById('clear');
  google.maps.event.addDomListener(clear, 'click', clearClusters);

  refreshMap();
}

function clearClusters(e) {
  e.preventDefault();
  e.stopPropagation();
  markerClusterer.clearMarkers();
}

google.maps.event.addDomListener(window, 'load', initialize);
