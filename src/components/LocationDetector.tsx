import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationDetectorProps {
  onLocationDetected: (lat: number, lon: number, cityName: string) => void;
}

const LocationDetector = ({
  onLocationDetected = () => {},
}: LocationDetectorProps) => {
  const [cityName, setCityName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  useEffect(() => {
    // Try to get user's location when component mounts
    requestGeolocation();
  }, []);

  const requestGeolocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityName(latitude, longitude);
          setIsLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setPermissionDenied(true);
          setIsLoading(false);
          setError(
            "Location permission denied. Using Mumbai as default location.",
          );
          // Use Mumbai as default location
          setCityName("Mumbai");
          onLocationDetected(19.076, 72.8777, "Mumbai");
        },
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Using Mumbai as default location.",
      );
      setPermissionDenied(true);
      setIsLoading(false);
      // Use Mumbai as default location
      setCityName("Mumbai");
      onLocationDetected(19.076, 72.8777, "Mumbai");
    }
  };

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const API_KEY = "9102fcb602fc2c718391570e2dab5618";
      const baseUrl = "https://api.openweathermap.org/data/2.5";

      const response = await fetch(
        `${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch city name");
      }

      const data = await response.json();
      const cityName = data.name;
      setCityName(cityName);
      onLocationDetected(lat, lon, cityName);
    } catch (error) {
      console.error("Error fetching city name:", error);
      setError("Failed to fetch city name. Using Mumbai as default location.");
      setPermissionDenied(true);
      // Use Mumbai as default location
      setCityName("Mumbai");
      onLocationDetected(19.076, 72.8777, "Mumbai");
    }
  };

  const handleCitySearch = async () => {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Just directly pass the city name to the parent component
      // This will trigger a search by city name in the parent
      onLocationDetected(0, 0, cityName.trim());
    } catch (error) {
      console.error("Error searching city:", error);
      setError("City not found. Please check the spelling and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCitySearch();
    }
  };

  return (
    <Card className="w-full p-4 bg-white shadow-md">
      <div className="flex flex-col space-y-4">
        {!permissionDenied && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {isLoading
                ? "Detecting your location..."
                : "Allow location access for local weather"}
            </p>
            <Button
              variant="outline"
              onClick={requestGeolocation}
              disabled={isLoading}
            >
              {isLoading ? "Detecting..." : "Detect Location"}
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter city name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 w-full"
              disabled={isLoading}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button
            onClick={handleCitySearch}
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

export default LocationDetector;
