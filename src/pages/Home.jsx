import { useNavigate } from "react-router-dom";
import {
  FiPlayCircle,
  FiFolder,
  FiBook,
  FiCpu,
} from "react-icons/fi";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#0B0F14] text-white flex flex-col">

      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-[#0B0F14] border-b border-zinc-800">

        <div className="px-6 pt-8 pb-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/20">
              ∫
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                INCOG Mathematics
              </h1>

              <p className="text-gray-400">
                Engineering Mathematics Toolkit
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-6">

        <div className="grid gap-5">

          <button
            onClick={() => navigate("/workspace")}
            className="rounded-3xl bg-blue-600 hover:bg-blue-700 transition p-6 text-left"
          >

            <FiPlayCircle size={28} />

            <h2 className="mt-4 text-xl font-bold">
              Start Project
            </h2>

            <p className="mt-2 text-blue-100">
              Create and solve mathematics problems.
            </p>

          </button>

          <button
            onClick={() => navigate("/projects")}
            className="rounded-3xl bg-[#141A22] border border-zinc-800 hover:border-blue-500 transition p-6 text-left"
          >

            <FiFolder size={28} />

            <h2 className="mt-4 text-xl font-bold">
              Saved Projects
            </h2>

            <p className="mt-2 text-gray-400">
              Continue your previous work.
            </p>

          </button>

          <button
            onClick={() => navigate("/reference")}
            className="rounded-3xl bg-[#141A22] border border-zinc-800 hover:border-blue-500 transition p-6 text-left"
          >

            <FiBook size={28} />

            <h2 className="mt-4 text-xl font-bold">
              Formula Reference
            </h2>

            <p className="mt-2 text-gray-400">
              Browse formulas, derivations and examples.
            </p>

          </button>

          <button
            onClick={() => navigate("/ai")}
            className="rounded-3xl bg-[#141A22] border border-zinc-800 hover:border-blue-500 transition p-6 text-left"
          >

            <FiCpu size={28} />

            <h2 className="mt-4 text-xl font-bold">
              AI Assistant
            </h2>

            <p className="mt-2 text-gray-400">
              Ask mathematics questions with AI.
            </p>

          </button>

        </div>

        <div className="mt-10">

          <h2 className="text-xl font-semibold mb-4">
            Recent Projects
          </h2>

          <div className="rounded-2xl bg-[#141A22] border border-zinc-800 p-5 text-gray-400">
            No saved projects yet.
          </div>

        </div>

        <div className="h-10" />

      </main>

    </div>
  );
}

export default Home;