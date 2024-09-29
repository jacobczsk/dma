var races: any;

async function loadRaces() {
  races = await (await fetch("maps/maps.json")).json();
  races = races.maps.sort(
    (a: any, b: any) => Date.parse(b.date) - Date.parse(a.date)
  );
}

async function renderRaces() {
  await loadRaces();
  const racesBody = document.getElementById("racesBody");
  var i = 0;
  for (const race of races) {
    const parsedDate = new Date(Date.parse(race.date)).toLocaleDateString();
    racesBody!.innerHTML += `<tr onclick="window.location = 'map.html?id=${i}'"><td>${parsedDate}</td><td>${race.name}</td><td>${race.location}</td><td>${race.class}</td><td>${race.place}</td><td>${race.time}</td><td>${race.loss}</td></tr>`;
    i++;
  }
}

async function renderRace(idx: number) {
  await loadRaces();
  const race = races[idx];
  document.getElementById("map-img")!.setAttribute("src", race.file);
  document.getElementById("map-link")!.setAttribute("href", race.file);
  document.getElementById("map-date")!.innerText = new Date(
    Date.parse(race.date)
  ).toLocaleDateString();
  document.getElementById("map-name")!.innerText = race.name;
  document.getElementById("map-location")!.innerText = race.location;
  document.getElementById("map-class")!.innerText = race.class;
  document.getElementById("map-place")!.innerText = race.place;
  document.getElementById("map-time")!.innerText = race.time;
  document.getElementById("map-loss")!.innerText = race.loss;
  document.getElementById("eventsview")?.setAttribute("class", "hide");
  document.getElementById("eventview")?.setAttribute("class", "");
}
