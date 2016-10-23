/* global $ google */

var geojsonCache;
const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
const CLOSE = 500000;

$(document).ready(() => {
  $('.location-search').submit((event) => {
    event.preventDefault();
    const location = $('input:first').val();
    console.log(`Sumbitted! Location: ${location}`);
    if (location)
      findNear(location);
    else
      findCurrent();
  });

  $.ajax({
    url: URL,
    type: "GET",
    dataType: "json"
  }).done((json) => {
    geojsonCache = json;
  }).fail(() => {
    console.log("fail to acquire earthquakes data");
  }).always(() => {
    console.log("try loading geojson");
  });
});


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    // los angeles
    center: {lat: 34.03, lng: -118.15},
    scrollwheel: false,
    zoom: 8
  });
}

function findCurrent() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(`position: {lat: ${pos.lat}, lng: ${pos.lng}}`);

      var posLatLng = new google.maps.LatLng(pos.lat, pos.lng);
      updateMap(posLatLng);
    });
  } else {
    alert('location service unavailable');
  }
}

function findNear(address) {
  $.ajax({
    url: "https://maps.google.com/maps/api/geocode/json",
    data: {
      address: address
    },
    type: "GET",
    dataType: "json"
  }).done((geocode) => {
    let results = geocode.results;
    if (results.length == 0) {
      alert("no such location");
      return;
    }

    var loc = results[0].geometry.location;
    var locLatLng = new google.maps.LatLng(loc.lat, loc.lng);
    updateMap(locLatLng);

  }).fail(() => {
    alert("fail to load geocode");
  });
}

function updateMap(locLatLng) {
  var hasEarchQuake = false;
  for (let i = 0; i < geojsonCache.features.length; i++) {
    var curr_eq = geojsonCache.features[i];
    var eqLatLng = new google.maps.LatLng(curr_eq.geometry.coordinates[1],
                                          curr_eq.geometry.coordinates[0]);
    if (google.maps.geometry
        .spherical.computeDistanceBetween(locLatLng, eqLatLng) < CLOSE) {

      hasEarchQuake = true;
      console.log('earthquake found');
      // write to map
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: (eqLatLng.lat()+locLatLng.lat())/2,
                 lng: (eqLatLng.lng()+locLatLng.lng())/2},
        scrollwheel: false,
        zoom: 8
      });
      var marker_loc = new google.maps.Marker({
        position: locLatLng,
        animation: google.maps.Animation.DROP,
        icon: 'https://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png',
        map: map
      });
      var marker_eq = new google.maps.Marker({
        position: eqLatLng,
        animation: google.maps.Animation.DROP,
        map: map
      });

      var infowindow = new google.maps.InfoWindow({
        content: curr_eq.properties.title
      });
      marker_eq.addListener('click', () => {
        infowindow.open(map, marker_eq);
      });

      $("#title").html(curr_eq.properties.title);
      $("#status").html(curr_eq.properties.status);
      $('#time').html(new Date(curr_eq.properties.time));
      $("#magnitude").html(curr_eq.properties.mag);
      $("#depth").html(curr_eq.geometry.coordinates[2]);
      break;
    }
  }

  if (!hasEarchQuake)
    alert('no earthquakes near you');
}
