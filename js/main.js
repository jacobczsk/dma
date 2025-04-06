"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var races;
function loadRaces() {
    return __awaiter(this, void 0, void 0, function* () {
        races = yield (yield fetch("maps/maps.json")).json();
        races = races.maps.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    });
}
function renderRaces() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadRaces();
        const racesBody = document.getElementById("racesBody");
        var i = 0;
        for (const race of races) {
            const parsedDate = new Date(Date.parse(race.date)).toLocaleDateString();
            racesBody.innerHTML += `<tr onclick="window.location = 'map.html?id=${i}'"><td>${parsedDate}</td><td>${race.name}</td><td>${race.location}</td><td>${race.class}</td><td>${race.place}</td><td>${race.time}</td><td>${race.loss}</td></tr>`;
            i++;
        }
    });
}
function renderRace(idx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        yield loadRaces();
        const race = races[idx];
        document.getElementById("map-img").setAttribute("src", race.file);
        document.getElementById("map-link").setAttribute("href", race.file);
        document.getElementById("map-date").innerText = new Date(Date.parse(race.date)).toLocaleDateString();
        document.getElementById("map-name").innerText = race.name;
        document.getElementById("map-location").innerText = race.location;
        document.getElementById("map-class").innerText = race.class;
        document.getElementById("map-place").innerText = race.place;
        document.getElementById("map-time").innerText = race.time;
        document.getElementById("map-loss").innerText = race.loss;
        if (race.oris !== undefined) {
            document.getElementById("map-oris").setAttribute("href", `https://oris.orientacnisporty.cz/Zavod?id=${race.oris}`);
            document.getElementById("map-oris").innerText = race.oris;
        }
        else {
            document.getElementById("map-oris").innerText = "N/A";
        }
        (_a = document.getElementById("eventsview")) === null || _a === void 0 ? void 0 : _a.setAttribute("class", "hide");
        (_b = document.getElementById("eventview")) === null || _b === void 0 ? void 0 : _b.setAttribute("class", "");
    });
}
