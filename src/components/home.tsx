import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
} from "lucide-react";
import LocationDetector from "./LocationDetector";
import CurrentWeather from "./CurrentWeather";
import ForecastDisplay from "./ForecastDisplay";

interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

const Home = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>(
    "bg-gradient-to-br from-blue-400 to-blue-600",
  );

  const API_KEY = "9102fcb602fc2c718391570e2dab5618";
  const baseUrl = "https://api.openweathermap.org/data/2.5";

  const fetchWeatherData = async (
    lat: number,
    lon: number,
    cityName?: string,
  ) => {
    setLoading(true);
    setError(null);

    console.log("Fetching weather data:", { lat, lon, cityName });

    try {
      // If cityName is provided, use it for the search regardless of lat/lon
      const queryParam =
        cityName && cityName.trim() !== ""
          ? `q=${encodeURIComponent(cityName.trim())}`
          : `lat=${lat}&lon=${lon}`;
      console.log("Using query param:", queryParam);

      // Fetch current weather
      const currentResponse = await fetch(
        `${baseUrl}/weather?${queryParam}&units=metric&appid=${API_KEY}`,
      );

      if (!currentResponse.ok) {
        throw new Error("Failed to fetch current weather data");
      }

      const currentData = await currentResponse.json();
      console.log("Current weather data received:", currentData.name);

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${baseUrl}/forecast?${queryParam}&units=metric&appid=${API_KEY}`,
      );

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data");
      }

      const forecastData = await forecastResponse.json();

      // Process and format the data
      const location = `${currentData.name}, ${currentData.sys.country}`;

      // Process forecast data to get daily forecasts (one per day)
      const dailyForecasts = [];
      const processedDates = new Set();

      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString();

        if (!processedDates.has(date) && dailyForecasts.length < 5) {
          processedDates.add(date);
          dailyForecasts.push({
            date,
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
          });
        }
      }

      const formattedData: WeatherData = {
        location,
        current: {
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          icon: currentData.weather[0].icon,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed),
        },
        forecast: dailyForecasts,
      };

      setWeatherData(formattedData);
      updateBackgroundColor(currentData.weather[0].main);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Error fetching weather data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBackgroundColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        setBgColor("bg-gradient-to-br from-yellow-300 to-orange-500");
        break;
      case "clouds":
        setBgColor("bg-gradient-to-br from-gray-300 to-gray-500");
        break;
      case "rain":
      case "drizzle":
        setBgColor("bg-gradient-to-br from-blue-400 to-blue-700");
        break;
      case "thunderstorm":
        setBgColor("bg-gradient-to-br from-purple-500 to-purple-800");
        break;
      case "snow":
        setBgColor("bg-gradient-to-br from-blue-100 to-blue-300");
        break;
      case "mist":
      case "fog":
      case "haze":
        setBgColor("bg-gradient-to-br from-gray-300 to-gray-500");
        break;
      default:
        setBgColor("bg-gradient-to-br from-blue-400 to-blue-600");
    }
  };

  const handleLocationDetected = (
    lat: number,
    lon: number,
    cityName?: string,
  ) => {
    // If cityName is provided and we're doing a city search (lat and lon are 0)
    if (cityName && cityName.trim() !== "" && lat === 0 && lon === 0) {
      fetchWeatherData(0, 0, cityName.trim());
    }
    // Otherwise use coordinates
    else if (lat !== 0 || lon !== 0) {
      fetchWeatherData(lat, lon);
    }
    console.log("Location detected:", { lat, lon, cityName });
  };

  return (
    <div
      className={`min-h-screen ${bgColor} p-4 md:p-8 flex flex-col items-center justify-start transition-colors duration-500 bg-background`}
    >
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Weather Forecast
        </h1>

        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm shadow-lg">
          <LocationDetector onLocationDetected={handleLocationDetected} />
        </Card>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <Card className="p-6 mb-8 bg-red-100 text-red-800">
            <p className="text-center">{error}</p>
          </Card>
        )}

        {weatherData && !loading && (
          <>
            <CurrentWeather
              location={weatherData.location}
              temperature={weatherData.current.temp}
              condition={weatherData.current.condition}
              icon={weatherData.current.icon}
              humidity={weatherData.current.humidity}
              windSpeed={weatherData.current.windSpeed}
            />

            <ForecastDisplay forecast={weatherData.forecast} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
