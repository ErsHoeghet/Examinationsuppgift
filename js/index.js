const BASE_URL = "https://fathomless-shelf-54969.herokuapp.com";
const pageOne = document.querySelector("#pageOne");
const pageTwo = document.querySelector("#pageTwo");
let planetsData;

const planets = {
    solen: ["rgb(255,209,42)"],
    merkurius: ["rgb(136, 136, 136)", "/svg/1-merkurius.svg"],
    venus: ["rgb(231, 205, 205)", "/svg/2-venus.svg"],
    jorden: ["rgb(66, 142, 212)", "/svg/3-jorden.svg"],
    mars: ["rgb(239, 95, 95)", "/svg/4-mars.svg"],
    jupiter: ["rgb(226, 148, 104)", "/svg/5-jupiter.svg"],
    saturnus: ["rgb(199, 170, 114)", "/svg/6-saturnus.svg"],
    uranus: ["rgb(201, 212, 241)", "/svg/7-uranus.svg"],
    neptunus: ["rgb(122, 145, 167)", "/svg/8-neptunus.svg"],
}

async function getKey() {
    const response = await fetch(`${BASE_URL}/keys`, { method: 'POST' });
    const data = await response.json();
    return data.key;
}

async function getPlanets() {
    const key = await getKey();
    const response = await fetch(`${BASE_URL}/bodies`, {
        headers: {
            'x-zocom': key
        }
    });
    planetsData = await response.json();
}

getPlanets();

function placePlanets() {
    let planetCounter = 1;

    for (const planet in planets) {
        if (planet !== "solen") {
            planetsWrapperElem = document.querySelector(".pageOne__planetsWrapper");
            planetElem = document.createElement("img");
            planetElem.setAttribute("src", planets[planet][1])
            planetElem.setAttribute("id", planetCounter)
            planetElem.classList.add("planet");
            planetsWrapperElem.appendChild(planetElem);
            planetCounter++;
        }
    }
}

placePlanets();

function showPlanetInfo(planetID) {
    pageTwo.classList.add("show");

    setPlanetColor(planetID);
    printData(planetID);
}

function setPlanetColor(planetID) {
    pageTwoPlanet = document.querySelector(".pageTwo__planet");
    planetValues = Object.values(planets);
    planetColor = planetValues[(planetID)][0];
    pageTwoPlanetShwIn = document.querySelector(".pageTwo__planetShadowInner");
    pageTwoPlanetShwOut = document.querySelector(".pageTwo__planetShadowOuter");
    pageTwoPlanet.style.background = planetColor;
    pageTwoPlanetShwIn.style.background = planetColor;
    pageTwoPlanetShwIn.style.opacity = "0.1";
    pageTwoPlanetShwOut.style.background = planetColor;
    pageTwoPlanetShwOut.style.opacity = "0.06";
}

function printData(planetID) {
    let planetName = document.querySelector(".pageTwo__planetName");
    let planetNameLatin = document.querySelector(".pageTwo__planetNameLatin");
    let planetInfo = document.querySelector(".pageTwo__planetInfo");
    let planetCircumference = document.querySelector(".pageTwo__circumference");
    let planetMaxTemp = document.querySelector(".pageTwo__maxTemp");
    let planetKmFromSun = document.querySelector(".pageTwo__kmFromSun");
    let planetMinTemp = document.querySelector(".pageTwo__minTemp");
    let planetMoons = document.querySelector(".pageTwo__moons");

    planetName.innerText = planetsData.bodies[planetID].name.toUpperCase();
    planetNameLatin.innerText = planetsData.bodies[planetID].latinName.toUpperCase();
    planetInfo.innerText = planetsData.bodies[planetID].desc;
    planetCircumference.innerText = adjustNumbers(planetsData.bodies[planetID].circumference);
    planetMaxTemp.innerText = planetsData.bodies[planetID].temp.day + "C";
    planetKmFromSun.innerText = adjustNumbers(planetsData.bodies[planetID].distance);
    planetMinTemp.innerText = planetsData.bodies[planetID].temp.night + "C";
    planetMoons.innerText = planetsData.bodies[planetID].moons.join(", ");
}

function adjustNumbers(num) {
    num = num.toLocaleString("se-SE", {
        style: "unit",
        unit: "kilometer",
        unitDisplay: "narrow",
    })

    numArr = num.split("");
    numArr.splice((num.length - 2), 0, " ");
    num = numArr.join("");

    return num;
}

function hidePlanetInfo() {
    pageTwo.classList.remove("show");
}



document.addEventListener("click", (event) => {
    whatClicked = event.target;

    if (whatClicked.hasAttribute("id") && whatClicked.classList.contains("planet") && !pageTwo.classList.contains("show")) {
        showPlanetInfo(whatClicked.id);
    }
    else if (pageTwo.classList.contains("show")) {
        hidePlanetInfo();
    }
});