//extracts the data I want from the API object
function destructureWeather({
  name,
  main: { temp, feels_like, humidity },
  weather: { description },
  wind: { speed },
}) {
  document.querySelector(
    "#current"
  ).textContent = `City of ${name}, temperature: ${temp}, feels like: ${feels_like}, humidity: ${humidity}, and wind speed ${speed}`;
}

async function defaultWeather() {
  const defaultCity = "New York";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=imperial&APPID=d53b7a1b0831587e43e406c3f5532905`,
    { mode: "cors" }
  );
  const weatherData = await response.json();
  destructureWeather(weatherData);
}
window.addEventListener("load", defaultWeather);

const search = document.querySelector("input");
search.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&units=imperial&APPID=d53b7a1b0831587e43e406c3f5532905`,
        { mode: "cors" }
      );
      const location = await response.json();
      console.log(location);
      destructureWeather(location);
    } catch (err) {
      return null;
    }
    search.value = "";
  }
});
