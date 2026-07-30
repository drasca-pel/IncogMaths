import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Workspace from "./pages/WorkSpace";
import SavedProjects from "./pages/SavedProjects";
import AIChat from "./pages/AIChat";
import FormulaReference from "./pages/FormulaReference";
import Projects from "./pages/Projects";

import Splash from "./components/Splash";

import {
  setupInstallPrompt,
  showInstallPrompt,
} from "./installPrompt";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setupInstallPrompt();

    const handleInstallAvailable = () => {
      setCanInstall(true);
    };

    const handleInstalled = () => {
      setCanInstall(false);
    };

    window.addEventListener(
      "incog-install-available",
      handleInstallAvailable
    );

    window.addEventListener(
      "incog-app-installed",
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        "incog-install-available",
        handleInstallAvailable
      );

      window.removeEventListener(
        "incog-app-installed",
        handleInstalled
      );
    };
  }, []);

  if (showSplash) {
    return (
      <Splash
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <BrowserRouter>

      {canInstall && (
        <button
          onClick={async () => {
            const installed = await showInstallPrompt();

            if (installed) {
              setCanInstall(false);
            }
          }}
          className="
            fixed
            bottom-5
            right-5
            z-[9999]
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-semibold
            text-white
            shadow-xl
            transition
            hover:bg-blue-700
            active:scale-95
          "
        >
          Install INCOG Maths
        </button>
      )}

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/workspace"
          element={<Workspace />}
        />

        <Route
          path="/projects"
          element={<SavedProjects />}
        />

        <Route
          path="/ai"
          element={<AIChat />}
        />

        <Route
          path="/reference"
          element={<FormulaReference />}
        />

        <Route
          path="/projects/all"
          element={<Projects />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;