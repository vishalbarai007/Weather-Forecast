import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import SplashScreen from "./components/SplashScreen";
import routes from "tempo-routes";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} duration={2500} />
        )}

        <div className={showSplash ? "hidden" : "block"}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </div>
      </>
    </Suspense>
  );
}

export default App;
