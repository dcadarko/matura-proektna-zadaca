var lat = null;
var lon = null;
var podatoci = null;
var tabela = document.getElementById("tabela");
/* Funkcija za prebaruvanje na razlichnite tipovi na biznisi */

async function prebaruvaj() {
  /* resetiranje na tabelata */
  var td = tabela.getElementsByTagName("td");
  while (td[0]) {
    td[0].parentNode.removeChild(td[0]);
  }

  tabela.classList.remove("nevidliva");
  var mesto = document.getElementById("mesto").value;
  var lonlat = null;
  try {
    /* Ovaa fetch funkcija go povikuva APIto za dobivanje na geografskite koordinati na odredeno mesto*/
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${String(
        mesto
      )}.json?access_token=pk.eyJ1IjoiZGNhZGFya28iLCJhIjoiY2xlZXk4am96MGxxNzNvdGtkeHMxZHZscCJ9.zPckCAnl0Fh1gD0E_WNKLA`
    );
    /* Se zachuvuvaat longitudata i latitudata na mestoto */
    const data = await response.json();
    lonlat = data.features[0].center;
    lon = lonlat[0];
    lat = lonlat[1];
    /*Se povikuva funkcijata koja gi prebaruva biznisite */
    await prebaruvajBiznisi();
    await dodavanjeNaPodatocite();
  } catch (err) {
    console.error(err);
  }
}

/*Funkcijata prebaruva biznisi od razlichni tipovi */
async function prebaruvajBiznisi() {
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
    podatoci = data.results;
  } catch (err) {
    console.error(err);
  }
}
/*funkcija za dodavanje na elementi vo tabela */
async function dodavanjeNaPodatocite() {
  for (const v of podatoci) {
    var red = tabela.insertRow(1);
    var kelija1 = red.insertCell(0);
    var kelija2 = red.insertCell(1);
    var kelija3 = red.insertCell(2);
    kelija2.innerHTML = v.name;
    kelija3.innerHTML = `<a href="https://www.google.com/maps/@${v.geocodes.main.latitude},${v.geocodes.main.longitude},21z" target="_blank">${v.geocodes.main.latitude}, ${v.geocodes.main.longitude}</a>`;
    const slika = await getSliki(v.fsq_id);
    console.log(slika);
    if (slika != "undefinedoriginalundefined") {
      kelija1.innerHTML = `<img src="${slika}" alt="" width="300" height="300">`;
    } else {
      kelija1.innerHTML = "Моментално нема слика од бизнисот";
    }
  }
}

/* Funkcija za dobivanje na slikite */
async function getSliki(fsq_id) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "fsq3uYiJQQsglWe84TckhFhdRWen/vyOp/PFSUk46cgyANY=",
    },
  };

  const response = await fetch(
    `https://api.foursquare.com/v3/places/${fsq_id}/photos`,
    options
  );

  const data = await response.json();

  const slika = data?.[0]?.prefix + "original" + data?.[0]?.suffix;

  return slika;
}
