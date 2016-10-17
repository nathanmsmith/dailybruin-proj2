$(() => {
  $(".location-search").submit(event => {
    event.preventDefault()
    const location = $("input:first").val()
    alert("Sumbitted! Location: " + location)
  });
});
