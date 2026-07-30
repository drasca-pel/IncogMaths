import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
import SavedProjects from "./pages/SavedProjects";
import AIChat from "./pages/AIChat";
import FormulaReference from "./pages/FormulaReference";
import Projects from "./pages/Projects";

function App() {
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
         <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;