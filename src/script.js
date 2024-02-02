import { apiKey } from "./config.js";

const searchButton = document.querySelector(".search__button");
const searchInput = document.querySelector(".search__input");
const container = document.querySelector(".container");

// Convert the unix time to utc
const timeConvertor = function (unixTime) {
  const dateObj = new Date(unixTime * 1000);
  const utcString = dateObj.toUTCString().slice(-11, -4);
  return utcString;
};

const dateConvertor = function (date) {
  const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const monthDate = date.slice(5, 7);
  let dayDate = date.slice(8, 10);
  if (Number(dayDate) < 10) {
    dayDate = date.slice(9, 10);
  }
  const timeDate = date.slice(-8);

  return `
    <div class="forecast__item--date">
      <p>${dayDate} ${months[monthDate]}</p>
      <p>${timeDate}</p>
    </div>
  `;
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
            <p class="card__description text-lg">
            ${data.weather[0].description}
            </p>
          </div>
        </div>
        <div class="card">
          <p class="text-xl">Humidity:</p>
          <h1 class="card__humidity text-4xl">
          ${data.main.humidity}%
          </h1>
        </div>
        <div class="card">
          <p class="text-xl">Wind speed:</p>
          <h1 class="card__wind text-4xl">
            ${data.wind.speed} 
            <span class="text-xl text-slate-300">km/h</span>
          </h1>
        </div>
        <div class="card">
          <p class="text-xl">Pressure:</p>
          <h1 class="card__pressure text-4xl">
          ${data.main.pressure} 
          <span class="text-xl text-slate-300">hPa</span>
          </h1>
        </div>
        <div class="card flex-col">
          <div class="w-full flex justify-between items-center">
            <p>Sunrise:</p>
            <h1 class="card__sunrise text-2xl">
              ${timeConvertor(data.sys.sunrise)}
            </h1>
          </div>
          <div class="w-full flex justify-between items-center">
            <p>Sunset:</p>
              <h1 class="card__sunset text-2xl">
                ${timeConvertor(data.sys.sunset)}
              </h1>
          </div>
        </div>
        <div class="card col-span-2">
          <div class="card__pollution w-full h-full"></div>
        </div>
        <div class="col-span-2 md:col-span-4">
          <div class="card__forecast w-full h-full grid grid-cols-2 md:grid-cols-4 gap-3"></div>
        </div>
      </div>
`;
  container.innerHTML = html;
};

const renderError = function () {
  const html = `
  <div class="flex items-center justify-evenly flex-wrap md:flex-nowrap w-4/5 mx-auto">
    <img src="../images/404.svg" class="w-full md:w-1/2" alt="City not found" />
    <p class="text-2xl">
      City not found!
    </p>
  </div>
  `;
  container.innerHTML = html;
};

// Render Forecast
const renderForecast = function (forecastData) {
  const dateTime = forecastData.dt_txt;
  const temperature = forecastData.main.temp;
  const weatherDescription = forecastData.weather[0].description;
  const weatherIcon = forecastData.weather[0].icon;

  const forecastHTML = `
    <div class="card forecast-item flex items-center justify-around">
      ${dateConvertor(dateTime)}
      <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon" class="w-16 h-16">
      <div class="flex flex-col items-center">
        <p class="text-2xl">${Math.round(temperature)}°C</p>
        <p>${weatherDescription}</p>
      </div>
    </div>
  `;
  return forecastHTML;
};

// Render Air Pollution
const renderAirPollution = function (data) {
  const airQuality = {
    1: { des: "Good", class: "text-green-500" },
    2: { des: "Fair", class: "text-lime-400" },
    3: { des: "Moderate", class: "text-yellow-400" },
    4: { des: "Poor", class: "text-red-400" },
    5: { des: "Very Poor", class: "text-red-600" },
  };
  return `
  <div class="${airQuality[data.list[0].main.aqi].class} text-4xl">
    ${airQuality[data.list[0].main.aqi].des}
  </div>
  `;
};

// Fetch the Air Pollution
const fetchAirPollution = async function (lat, lon) {
  try {
    const resPollution = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const dataPollution = await resPollution.json();

    console.log(dataPollution);
    console.log(renderAirPollution(dataPollution));

    const pollution = document.querySelector(".card__pollution");
    pollution.innerHTML = renderAirPollution(dataPollution);
  } catch (err) {
    console.log(err.message);
  }
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
      const forecastItem = renderForecast(forecastData);
      forecast.innerHTML += forecastItem;
      console.log(forecastData);
    });
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
    fetchForecast(dataWeather.coord.lat, dataWeather.coord.lon);
    fetchAirPollution(dataWeather.coord.lat, dataWeather.coord.lon);
  } catch (err) {
    renderError();
    console.error(err.message);
  }
};

// Event listeners
searchButton.addEventListener("click", () => fetchWeather(searchInput.value));
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && searchInput.value != "") {
    fetchWeather(searchInput.value);
  } else {
    return;
  }
});
