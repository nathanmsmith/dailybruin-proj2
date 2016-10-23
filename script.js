/* global $ google */

$(document).ready(() => {
  $('.location-search').submit((event) => {
    event.preventDefault();
    const location = $('input:first').val();
    alert(`Sumbitted! Location: ${location}`);
  });

  $('.geolocation-search').click(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        alert(`position: ${pos}`);
      });
    }
  });
});


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: false,
    zoom: 8
  });
}
