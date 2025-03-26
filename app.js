const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

let cityInput = "London";

// Додаємо обробники на кліки по містах
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

// Обробка форми пошуку
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (search.value.length === 0) {
        alert('Please type in a city name');
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0";
    }
});

// Визначення дня тижня
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday", "Monday", "Tuesday",
        "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

// Завантаження погоди
function fetchWeatherData() {
    fetch(`https://api.weatherapi.com/v1/current.json?key=863e9eba331d45fe948112104252603&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            temp.innerHTML = `${data.current.temp_c}&#176;`;
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${m}/${d}/${y}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            const iconUrl = data.current.condition.icon;
            const iconId = iconUrl.split("/").slice(-2).join("/");
            icon.src = `./icons/${iconId}`;

            cloudOutput.innerHTML = `${data.current.cloud}%`;
            humidityOutput.innerHTML = `${data.current.humidity}%`;
            windOutput.innerHTML = `${data.current.wind_kph}km/h`;

            // Визначення часу доби
            const isDay = data.current.is_day;
            let timeOfDay = isDay ? "day" : "night";
            const code = data.current.condition.code;

            // Встановлення фону
            if (code === 1000) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
                btn.style.background = isDay ? "#e5ba92" : "#181e27";
            } else if (
                [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = isDay ? "#fa6d1b" : "#181e27";
            } else if (
                [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189,
                 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = isDay ? "#647d75" : "#325c80";
            } else {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
                btn.style.background = isDay ? "#4d72aa" : "#1b1b1b";
            }

            app.style.opacity = "1";
        })
        .catch(() => {
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}

// Стартове завантаження
fetchWeatherData();
app.style.opacity = "1";
