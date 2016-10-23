/* global $ google */

var geojsonCache;
const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
const CLOSE = 500000;

$(document).ready(() => {
  $('.location-search').submit((event) => {
    event.preventDefault();
    const location = $('input:first').val();
    console.log(`Sumbitted! Location: ${location}`);
    findNear(location);
  });

  // not implemented
  $('.geolocation-search').click(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(`position: ${pos}`);
      });
    }
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

    for (let i = 0; i < geojsonCache.features.length; i++) {
      var curr_eq = geojsonCache.features[i];
      var eq = new google.maps.LatLng(curr_eq.lat,
                                      curr_eq.lng);
      if (google.maps.geometry
          .spherical.computeDistanceBetween(locLatLng, eq) < CLOSE) {
        console.log('earthquake found');
        // write to map
        var map = new google.maps.Map(document.getElementById('map'), {
          center: eq,
          scrollwheel: false,
          zoom: 8
        });

        $("#title").html(curr_eq.properties.title);
        $("#status").html(curr_eq.properties.status);
        $('#time').html(new Date(curr_eq.properties.time));
        $("#magnitude").html(curr_eq.properties.mag);
        break;
      }
    }
  }).fail(() => {
    alert("fail to load geocode");
  });
}
