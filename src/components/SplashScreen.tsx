import React, { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const SplashScreen = ({
  onComplete = () => {},
  duration = 2000,
}: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 z-50">
      <div className="relative mb-8">
        <Sun className="h-24 w-24 text-yellow-400 animate-pulse" />
        <Cloud
          className="h-16 w-16 text-white absolute -bottom-2 -right-4 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <CloudRain
          className="h-12 w-12 text-blue-300 absolute -bottom-4 -left-4 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider">
        Weather App
      </h1>

      <div className="flex items-center justify-center space-x-2">
        <div
          className="w-3 h-3 rounded-full bg-white animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-3 h-3 rounded-full bg-white animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-3 h-3 rounded-full bg-white animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export default SplashScreen;
