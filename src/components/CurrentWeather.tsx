import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Droplets, Wind, Thermometer, Sun } from "lucide-react";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
}

interface CurrentWeatherProps {
  weatherData?: WeatherData;
  isLoading?: boolean;
  error?: string;
}

const CurrentWeather = ({
  location,
  temperature,
  condition,
  icon,
  humidity,
  windSpeed,
}: {
  location?: string;
  temperature?: number;
  condition?: string;
  icon?: string;
  humidity?: number;
  windSpeed?: number;
}) => {
  // Default values if props are not provided
  const weatherData = {
    city: location?.split(",")?.[0] || "Mumbai",
    country: location?.split(",")?.[1]?.trim() || "IN",
    temperature: temperature || 32,
    feelsLike: temperature ? temperature + 2 : 34,
    description: condition || "Clear sky",
    icon: icon || "01d",
    humidity: humidity || 70,
    windSpeed: windSpeed || 3.5,
    sunrise: "6:15 AM",
    sunset: "6:45 PM",
  };
  const isLoading = false;
  const error = "";
  // Function to determine background color based on weather condition
  const getBackgroundColor = (icon: string) => {
    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (icon.startsWith("01"))
      return "bg-gradient-to-br from-blue-400 to-blue-600"; // clear sky
    if (icon.startsWith("02") || icon.startsWith("03") || icon.startsWith("04"))
      return "bg-gradient-to-br from-blue-300 to-gray-400"; // clouds
    if (icon.startsWith("09") || icon.startsWith("10"))
      return "bg-gradient-to-br from-blue-400 to-gray-600"; // rain
    if (icon.startsWith("11"))
      return "bg-gradient-to-br from-gray-600 to-gray-800"; // thunderstorm
    if (icon.startsWith("13"))
      return "bg-gradient-to-br from-blue-100 to-blue-300"; // snow
    if (icon.startsWith("50"))
      return "bg-gradient-to-br from-gray-300 to-gray-500"; // mist
    return "bg-gradient-to-br from-blue-400 to-blue-600"; // default
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-background">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-xl">Loading weather data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-background">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-destructive text-xl">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full max-w-4xl mx-auto ${getBackgroundColor(weatherData.icon)} text-white`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center">
          {weatherData.city}, {weatherData.country}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`}
              alt={weatherData.description}
              className="w-32 h-32"
            />
            <p className="text-xl capitalize">{weatherData.description}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold">
              {Math.round(weatherData.temperature)}°C
            </div>
            <p className="text-lg">
              Feels like: {Math.round(weatherData.feelsLike)}°C
            </p>
          </div>
        </div>

        <Separator className="my-6 bg-white/20" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Droplets className="h-6 w-6" />
            <span className="text-lg">Humidity: {weatherData.humidity}%</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <Wind className="h-6 w-6" />
            <span className="text-lg">Wind: {weatherData.windSpeed} m/s</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sun className="h-6 w-6" />
            <div className="text-lg">
              <span className="block md:inline">
                Sunrise: {weatherData.sunrise}
              </span>
              <span className="hidden md:inline"> | </span>
              <span className="block md:inline">
                Sunset: {weatherData.sunset}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
