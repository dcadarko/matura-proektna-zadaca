var lat = null;
var lon = null;

async function search() {
  var mesto = document.getElementById("mesto").value;
  var lonlat = null;
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${String(
        mesto
      )}.json?access_token=pk.eyJ1IjoiZGNhZGFya28iLCJhIjoiY2xlZXk4am96MGxxNzNvdGtkeHMxZHZscCJ9.zPckCAnl0Fh1gD0E_WNKLA`
    );
    const data = await response.json();
    lonlat = data.features[0].center;
    lon = lonlat[0];
    lat = lonlat[1];
    await placeSearch();
  } catch (err) {
    console.error(err);
  }
}

async function placeSearch() {
  try {
    const searchParams = new URLSearchParams({
      query: document.getElementById("tip").value,
      ll: `${lat},${lon}`,
      open_now: "false",
      sort: "DISTANCE",
    });
    const results = await fetch(
      `https://api.foursquare.com/v3/places/search?${searchParams}&limit=50`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "fsq3uYiJQQsglWe84TckhFhdRWen/vyOp/PFSUk46cgyANY=",
        },
      }
    );
    const data = await results.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
