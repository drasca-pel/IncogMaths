import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MathEditor from "../components/mathematics/MathEditor";
import FormulaSidebar from "../components/mathematics/FormulaSidebar";
import ResultPanel from "../components/mathematics/ResultPanel";
import SaveProjectModal from "../components/mathematics/SaveProjectModal";

import { solveMaths } from "../services/ai/incogAI";

function Workspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);

  const [equation, setEquation] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("editor");
  const [loading, setLoading] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [changed, setChanged] = useState(false);

  // Load existing project if navigated from SavedProjects
  useEffect(() => {
    const project = location.state?.project;

    if (project) {
      setProjectId(project.id);
      setProjectName(project.name);
      setEquation(project.equation || "");
      setResult(project.result || null);
      setMode("editor");
      setChanged(false);
    }
  }, [location.state]);

  function changeEquation(value) {
    setEquation(value);
    setChanged(true);
  }

  async function handleSolve() {
    if (!equation.trim()) return;

    setLoading(true);

    try {
      const response = await solveMaths(equation, []);
      console.log("SOLVE RESULT:", response);

      setResult(response);
      setMode("result");
      setChanged(true);
    } catch (error) {
      console.error("SOLVE ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  function saveProject(name) {
    const projects = JSON.parse(localStorage.getItem("incog_projects") || "[]");
    const finalName = name?.trim() || projectName?.trim() || `Project ${new Date().toLocaleDateString()}`;

    // Update Existing Project
    if (projectId) {
      const updated = projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            name: finalName,
            equation,
            result,
            updatedAt: new Date().toLocaleString(),
          };
        }
        return project;
      });

      localStorage.setItem("incog_projects", JSON.stringify(updated));
      setProjectName(finalName);
      setChanged(false);
      return;
    }

    // Create New Project
    const newProject = {
      id: Date.now(),
      name: finalName,
      equation,
      result,
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem("incog_projects", JSON.stringify([newProject, ...projects]));
    setProjectId(newProject.id);
    setProjectName(finalName);
    setChanged(false);
  }

  function handleSaveHeaderClick() {
    if (projectId) {
      // Direct save if project already has an ID/Name
      saveProject(projectName);
    } else {
      // Ask for project name if it's new
      setSaveOpen(true);
    }
  }

  function handleBack() {
    if (changed) {
      setExitOpen(true);
    } else {
      navigate(-1);
    }
  }

  function editEquation() {
    setMode("editor");
  }

  function insertFormula(formula) {
    if (editorRef.current) {
      editorRef.current.insertFormula(formula);
    }
    setFormulaOpen(false);
  }

  function saveAndExit() {
    if (!projectId && !projectName) {
      // Open modal first if saving an unnamed new project from exit prompt
      setExitOpen(false);
      setSaveOpen(true);
      return;
    }
    saveProject(projectName);
    navigate(-1);
  }

  function exitWithoutSave() {
    navigate(-1);
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0B0F14] text-white flex flex-col">
      {/* Header */}
      <header className="h-[70px] flex items-center justify-between px-5 bg-[#141A22] border-b border-zinc-800">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-95 transition"
        >
          ←
        </button>

        <h1 className="font-bold text-lg truncate max-w-[200px]">
          {projectName || "INCOG Mathematics"}
        </h1>

        <button
          onClick={handleSaveHeaderClick}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 font-semibold transition"
        >
          {changed ? "Save*" : "Save"}
        </button>
      </header>

      {/* Main Workspace Body */}
      {mode === "editor" ? (
        <main className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <MathEditor ref={editorRef} value={equation} onChange={changeEquation} />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFormulaOpen(true)}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 font-medium transition"
            >
              ∑ Formula
            </button>

            <button
              onClick={handleSolve}
              disabled={loading || !equation.trim()}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-95 font-semibold transition"
            >
              {loading ? "Solving..." : "Solve"}
            </button>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 bg-[#141A22] flex justify-between items-center border-b border-zinc-800">
            <div>
              <p className="text-xs text-gray-400">Equation</p>
              <p className="font-mono text-sm mt-0.5">{equation}</p>
            </div>

            <button
              onClick={editEquation}
              className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-xl text-sm font-medium transition"
            >
              Edit
            </button>
          </div>

          {/* Scroll container for solution */}
          <div className="flex-1 overflow-y-auto p-5">
            <ResultPanel result={result} />
          </div>
        </main>
      )}

      {/* Modals & Drawers */}
      <FormulaSidebar
        open={formulaOpen}
        onClose={() => setFormulaOpen(false)}
        onSelectFormula={insertFormula}
      />

      <SaveProjectModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={(name) => {
          saveProject(name);
          setSaveOpen(false);
        }}
      />

      {/* Exit Confirmation Dialog */}
      {exitOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141A22] p-6 rounded-3xl w-full max-w-md border border-zinc-800">
            <h2 className="text-xl font-bold mb-2">Unsaved changes</h2>
            <p className="text-sm text-gray-400 mb-6">
              Do you want to save your work before leaving?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setExitOpen(false)}
                className="flex-1 bg-zinc-800 py-3 rounded-xl text-sm font-medium hover:bg-zinc-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={exitWithoutSave}
                className="flex-1 bg-red-600/80 py-3 rounded-xl text-sm font-medium hover:bg-red-600 transition"
              >
                Exit
              </button>

              <button
                onClick={saveAndExit}
                className="flex-1 bg-blue-600 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workspace;