/* global $ google */

var geojsonCache;
const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

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

    var location = results[0].geometry.location;
  }).fail(() => {
    alert("fail to load geocode");
  });
}

function distance() {
  google.maps.geometry.spherical.computeDistanceBetween;
}
