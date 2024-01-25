"use strict";

const searchButton = document.querySelector(".search__button");
const searchInput = document.querySelector(".search__input");
const container = document.querySelector(".container");

// Convert the unix time to utc
const timeConvertor = function (unixTime) {
  const dateObj = new Date(unixTime * 1000);
  const utcString = dateObj.toUTCString().slice(-11, -4);
  return utcString;
};

const renderWeather = function (data) {
  const html = `
      <section class="text-white w-full p-4 flex justify-center flex-row items-center">
        <i class="fa-solid fa-location-dot text-2xl mr-2"></i>
        <h1 class="location text-3xl">${data.name}</h1>
      </section>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-4/5 mt-4 mx-auto">
        <div
          class="card justify-around items-center col-span-2 md:col-span-1 md:row-start-1 md:row-end-3 md:flex-col"
        >
          <img src="https://openweathermap.org/img/wn/${
            data.weather[0].icon
          }@4x.png" class="card__icon w-36 rounded-md" />

          <div class="flex flex-col items-center">
            <h1 class="card__temp text-5xl">${Math.round(data.main.temp)}°C</h1>
            <p class="card__description text-lg">${
              data.weather[0].description
            }</p>
          </div>
        </div>
        <div class="card">
          <p class="text-xl">Humidity:</p>
          <h1 class="card__humidity text-4xl text-slate-900">
          ${data.main.humidity}%
          </h1>
        </div>
        <div class="card">
          <p class="text-xl">Wind speed:</p>
          <h1 class="card__wind text-4xl text-slate-900">
            ${data.wind.speed} km/h
          </h1>
        </div>
        <div class="card">
          <p class="text-xl">Pressure:</p>
          <h1 class="card__pressure text-4xl text-slate-900">
          ${data.main.pressure} hPa
          </h1>
        </div>
        <div class="card flex-col">
          <div class="w-full flex justify-between items-center">
            <p>Sunrise:</p>
            <h1 class="card__sunrise text-2xl text-slate-900">\
              ${timeConvertor(data.sys.sunrise)}
            </h1>
          </div>
          <div class="w-full flex justify-between items-center">
            <p>Sunset:</p>
              <h1 class="card__sunset text-2xl text-slate-900">
                ${timeConvertor(data.sys.sunset)}
              </h1>
          </div>
        </div>
        <div class="card col-span-2"></div>
        <div class="card col-span-2 md:col-span-4">
          <canvas class="card__chart" width="400" height="200"></canvas>
        </div>
      </div>
`;
  // container.insertAdjacentHTML("beforeend", html);

  container.innerHTML = html;
};

const renderError = function () {
  const html = `
  <div class="flex items-center justify-evenly flex-wrap md:flex-nowrap w-4/5 mx-auto">
    <img src="../images/404.svg" class="w-full md:w-1/2" />
    <p class="text-2xl">
      City not found!
    </p>
  </div>
  `;

  // container.insertAdjacentHTML("beforeend", html);
  container.innerHTML = html;
};

const fetchWeather = async function (city) {
  try {
    const resWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=71b002d857ecaed077a079f9a107b0a4&units=metric`
    );

    if (!resWeather.ok) throw new Error("City not found!");

    const dataWeather = await resWeather.json();
    console.log(dataWeather);

    renderWeather(dataWeather);
  } catch (err) {
    console.error(err);
    renderError();
  }
};

searchButton.addEventListener("click", () => fetchWeather(searchInput.value));

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && searchInput.value != "") {
    fetchWeather(searchInput.value);
  } else {
    return;
  }
});
