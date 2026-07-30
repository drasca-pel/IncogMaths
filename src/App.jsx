import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
import SavedProjects from "./pages/SavedProjects";
import AIChat from "./pages/AIChat";
import FormulaReference from "./pages/FormulaReference";
import Projects from "./pages/Projects";
import Splash from "./components/Splash";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <Splash
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <BrowserRouter>
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
          path="/saved-projects"
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
          path="/projects"
          element={<Projects />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;