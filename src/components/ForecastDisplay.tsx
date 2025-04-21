import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cloud, CloudRain, Sun, CloudSun, Snowflake } from "lucide-react";

interface ForecastDay {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

interface ForecastDisplayProps {
  forecast: ForecastDay[];
  units?: "metric" | "imperial";
}

const ForecastDisplay = ({
  forecast = [
    {
      date: "2023-06-01",
      day: "Mon",
      high: 28,
      low: 18,
      condition: "Clear",
      icon: "01d",
    },
    {
      date: "2023-06-02",
      day: "Tue",
      high: 27,
      low: 17,
      condition: "Clouds",
      icon: "02d",
    },
    {
      date: "2023-06-03",
      day: "Wed",
      high: 25,
      low: 16,
      condition: "Rain",
      icon: "10d",
    },
    {
      date: "2023-06-04",
      day: "Thu",
      high: 22,
      low: 15,
      condition: "Clouds",
      icon: "03d",
    },
    {
      date: "2023-06-05",
      day: "Fri",
      high: 24,
      low: 16,
      condition: "Clear",
      icon: "01d",
    },
  ],
  units = "metric",
}: ForecastDisplayProps) => {
  // Function to get the appropriate weather icon based on the condition code
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "01d": <Sun className="h-10 w-10 text-yellow-500" />,
      "01n": <Sun className="h-10 w-10 text-yellow-400" />,
      "02d": <CloudSun className="h-10 w-10 text-blue-400" />,
      "02n": <CloudSun className="h-10 w-10 text-blue-300" />,
      "03d": <Cloud className="h-10 w-10 text-gray-400" />,
      "03n": <Cloud className="h-10 w-10 text-gray-400" />,
      "04d": <Cloud className="h-10 w-10 text-gray-500" />,
      "04n": <Cloud className="h-10 w-10 text-gray-500" />,
      "09d": <CloudRain className="h-10 w-10 text-blue-500" />,
      "09n": <CloudRain className="h-10 w-10 text-blue-500" />,
      "10d": <CloudRain className="h-10 w-10 text-blue-600" />,
      "10n": <CloudRain className="h-10 w-10 text-blue-600" />,
      "13d": <Snowflake className="h-10 w-10 text-blue-200" />,
      "13n": <Snowflake className="h-10 w-10 text-blue-200" />,
      // Default icon if code doesn't match
      default: <Cloud className="h-10 w-10 text-gray-400" />,
    };

    return iconMap[iconCode] || iconMap["default"];
  };

  const tempUnit = units === "metric" ? "°C" : "°F";

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        5-Day Forecast
      </h2>
      <Separator className="mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="font-medium text-lg">{day.day}</h3>
              <p className="text-sm text-gray-500 mb-2">{day.date}</p>

              <div className="my-2">{getWeatherIcon(day.icon)}</div>

              <p className="text-sm font-medium">{day.condition}</p>

              <div className="flex justify-between w-full mt-2">
                <span className="text-red-500 font-medium">
                  {day.high}
                  {tempUnit}
                </span>
                <span className="text-blue-500 font-medium">
                  {day.low}
                  {tempUnit}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForecastDisplay;
