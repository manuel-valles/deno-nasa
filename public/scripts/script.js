const selectPlanet = document.querySelector('#planets');
fetch('/planets')
  .then((planetsData) => planetsData.json())
  .then((planets) => {
    selectPlanet.innerHTML = planets.map(
      (planet) => `<option>${planet.kepler_name}</option>`
    );
  });
