import { useState, useEffect } from "react";
import "./index.css";

function Message({ loading, error }) {
  if (loading) {
    return <p className="text-2xl text-black">Carregando...</p>;
  }

  if (error) {
    return <p className="text-2xl text-red-500">{error} - Tente novamente!</p>;
  }
  return null;
}

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("São Paulo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "0201e82c4dcfbaa16f0c579cf6462b6d";

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Localização não encontrada");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const handleSearch = () => {
    fetchWeather();
  };

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center p-6 pt-24">
      <Header />
      <Search location={location} setLocation={setLocation} handleSearch={handleSearch} />
      <Message loading={loading} error={error} />
      {weatherData && <CurrentWeather weatherData={weatherData} />}
    </div>
  );
}

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 w-full text-center shadow-xl fixed top-0 left-0 right-0 z-10">
      <h1 className="text-4xl font-bold">App de Clima do Dré</h1>
    </header>
  );
}

function Search({ location, setLocation, handleSearch }) {
  return (
    <div className="flex flex-col sm:flex-row items-center mt-4 mb-4">
      <input
        type="text"
        placeholder="Digite uma cidade..."
        className="px-4 py-2 border rounded-full w-60 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 sm:mb-0 sm:mr-2"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        onClick={handleSearch}
      >
        Buscar
      </button>
    </div>
  );
}

function CurrentWeather({ weatherData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-6 p-6 bg-gray-800 rounded-xl shadow-lg">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-white mt-20">{weatherData.name}</h1>
        <p className="text-8xl font-bold text-blue-600">
          {Math.round(weatherData.main.temp)}°C
        </p>
        <p className="text-xl text-gray-400 mt-2">{weatherData.weather[0].description}</p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={weatherData.weather[0].description}
          className="w-32 h-32"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-white">
        <WeatherDetail label="Sensação Térmica" value={`${Math.round(weatherData.main.feels_like)}°C`} />
        <WeatherDetail label="Vento" value={`${(weatherData.wind.speed * 3.6).toFixed(2)} km/h`} />
        <WeatherDetail label="Umidade" value={`${weatherData.main.humidity}%`} />
        <WeatherDetail label="Pressão" value={`${weatherData.main.pressure} hPa`} />
        <WeatherDetail label="Visibilidade" value={`${weatherData.visibility / 1000} km`} />
        <WeatherDetail label="Nuvens" value={`${weatherData.clouds.all}%`} />
        <WeatherDetail label="Mínima" value={`${Math.round(weatherData.main.temp_min)}°C`} />
        <WeatherDetail label="Máxima" value={`${Math.round(weatherData.main.temp_max)}°C`} />
        <WeatherDetail
          label="Nascer do Sol"
          value={new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
        />
        <WeatherDetail
          label="Pôr do Sol"
          value={new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
        />
        <WeatherDetail
          label="Chuva"
          value={weatherData.rain ? `${weatherData.rain["1h"]} mm/h` : `0 mm/h`}
        />
      </div>
    </div>
  );
}

function WeatherDetail({ label, value }) {
  return (
    <div className="flex flex-col items-start">
      <h3 className="text-lg font-semibold text-gray-100">{label}</h3>
      <p className="text-2xl font-bold text-gray-200">{value}</p>
    </div>
  );
}

export default App;
