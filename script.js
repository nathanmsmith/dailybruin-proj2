/* global $ google */

var geojsonCache;
const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

$(document).ready(() => {
  $('.location-search').submit((event) => {
    event.preventDefault();
    const location = $('input:first').val();
    console.log(`Sumbitted! Location: ${location}`);
  });

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
    url: URL
  });
});


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.03, lng: -118.15},
    scrollwheel: false,
    zoom: 8
  });
}

function findNear() {
}
