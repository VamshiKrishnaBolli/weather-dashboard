import React, { useState } from "react";
import axios from "axios";

const API_KEY = "f03a80df6b272f22c32c689a504108e2";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0));
    } catch (err) {
      setError("City not found. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h1>Weather Dashboard</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        style={{ padding: "8px", width: "80%", marginBottom: "10px" }}
      />
      <button onClick={fetchWeather} style={{ padding: "8px", marginLeft: "5px" }}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>{weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
      {forecast.length > 0 && (
        <div>
          <h3>5-Day Forecast</h3>
          {forecast.map((day, index) => (
            <div key={index}>
              <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
              <p>{day.weather[0].description}</p>
              <p>{day.main.temp}°C</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
