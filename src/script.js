require("dotenv").config();

// Other code follows
const apiKey = process.env.API_KEY;
const debugMode = process.env.DEBUG === "true";

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
            <h1 class="card__sunrise text-2xl text-slate-900">
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
          <div class="card__forecast">${fetchForecast(
            data.coord.lat,
            data.coord.lon
          )}</div>
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

const renderForecast = function (forecastData) {
  const dateTime = forecastData.dt_txt;
  const temperature = forecastData.main.temp;
  const weatherDescription = forecastData.weather[0].description;
  const weatherIcon = forecastData.weather[0].icon;

  // Create the HTML structure for the forecast item
  const forecastHTML = `
    <div class="forecast-item">
      <p>Date/Time: ${dateTime}</p>
      <p>Temperature: ${temperature} </p>
      <p>Weather: ${weatherDescription}</p>
      <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
    </div>
  `;

  return forecastHTML;
};

// Fetch the Forecast API

const fetchForecast = async function (lat, lon) {
  try {
    const resForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&appid=${apiKey}&units=metric`
    );

    const dataForecast = await resForecast.json();

    const forecast = document.querySelector(".card__forecast");

    dataForecast.list.forEach((forecastData) => {
      const forecastHTML = renderForecast(forecastData);
      forecast.insertAdjacentHTML("beforeend", forecastHTML);
      console.log(forecastData);
    });
    console.log(dataForecast);
  } catch (err) {
    console.error(err.message);
  }
};

// Fetch the current weather API
const fetchWeather = async function (city) {
  try {
    const resWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!resWeather.ok) throw new Error("City not found!");

    const dataWeather = await resWeather.json();
    console.log(dataWeather);

    renderWeather(dataWeather);
  } catch (err) {
    console.error(err.message);
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
