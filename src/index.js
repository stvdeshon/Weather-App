//extracts the data I want from the API object
function destructureCurrentWeather({
  name,
  main: { temp, feels_like, humidity },
  weather: [{ main }],
  wind: { speed },
}) {
  document.querySelector("#current-location").textContent = `${name}`;
  document.querySelector("#condition").textContent = `${main}`;
  document.querySelector("#temp").textContent = `Temperature: ${temp}`;
  document.querySelector(
    "#feels-like"
  ).textContent = `Feels like: ${feels_like}`;
  document.querySelector("#humidity").textContent = `Humidity: ${humidity}`;
  document.querySelector("#wind").textContent = `Wind: ${speed} MPH`;
}

async function defaultCurrentWeather() {
  const defaultCity = "New York";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=imperial&APPID=d53b7a1b0831587e43e406c3f5532905`,
    { mode: "cors" }
  );
  const weatherData = await response.json();
  destructureCurrentWeather(weatherData);
  fiveDayForecast(weatherData);
  console.log(weatherData);
}
window.addEventListener("load", defaultCurrentWeather);

const search = document.querySelector("input");
search.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&units=imperial&APPID=d53b7a1b0831587e43e406c3f5532905`,
        { mode: "cors" }
      );
      const location = await response.json();
      destructureCurrentWeather(location);
      fiveDayForecast(location);
    } catch (err) {
      return null;
    }
    search.value = "";
  }
});

async function fiveDayForecast({ coord: { lat, lon } }) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=d53b7a1b0831587e43e406c3f5532905`,
    { mode: "cors" }
  );
  const data = await response.json();
  let fiveDayArray = [];
  for (let i = 0; i < data.list.length; i++) {
    if (i == 4 || i == 12 || i == 20 || i == 28 || i == 36) {
      fiveDayArray.push(data.list[i]);
    }
  }
  displayForecast(fiveDayArray);
}

function displayForecast(array) {
  array.forEach((entry) => {
    document.querySelector(
      "#weather-container"
    ).innerHTML += `<div class="forecast">
    <p class="day">${dateSet(entry.dt_txt)}</p>
    <p class="condition">${entry.weather[0].main}</p>
    <p class="temp">${entry.main.temp}</p>
    <p class="feels-like">${entry.main.feels_like}</p>
    <p class="humidity">${entry.main.humidity}</p>
    <p class="wind">${entry.wind.speed}</p>
  </div>`;
  });
}

function dateSet(val) {
  const formattedDate = val.split(" ")[0];
  let d = new Date(`${formattedDate}`).toDateString().split(" ");
  return (date = d[0] + ", " + d[1] + " " + d[2]);
}
