$(() => {
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
          lng: position.coords.longitude,
        };

        alert(`position: ${pos}`);
      });
    }
  });
});
