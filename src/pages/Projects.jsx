import { useNavigate } from "react-router-dom";
import { FiFolder, FiPlus, FiTrash2 } from "react-icons/fi";

function Projects() {
  const navigate = useNavigate();

  // Temporary data
  const projects = [];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0B0F14] border-b border-zinc-800">

        <div className="flex items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-xl bg-[#141A22] hover:bg-zinc-700"
            >
              ←
            </button>

            <div>

              <h1 className="text-2xl font-bold">
                Saved Projects
              </h1>

              <p className="text-gray-400 text-sm">
                Continue where you stopped.
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/workspace")}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl p-3"
          >
            <FiPlus size={20} />
          </button>

        </div>

      </header>

      <main className="p-6">

        {projects.length === 0 ? (

          <div className="rounded-3xl border border-zinc-800 bg-[#141A22] p-12 text-center">

            <FiFolder
              size={60}
              className="mx-auto text-zinc-600"
            />

            <h2 className="mt-6 text-2xl font-semibold">
              No Saved Projects
            </h2>

            <p className="mt-2 text-gray-400">
              Your saved mathematics projects will appear here.
            </p>

            <button
              onClick={() => navigate("/workspace")}
              className="mt-8 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3"
            >
              Start New Project
            </button>

          </div>

        ) : (

          <div className="space-y-4">

            {projects.map((project) => (

              <div
                key={project.id}
                className="rounded-2xl bg-[#141A22] border border-zinc-800 p-5 flex justify-between items-center"
              >

                <div>

                  <h2 className="font-semibold">
                    {project.name}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {project.date}
                  </p>

                </div>

                <button className="text-red-400 hover:text-red-500">
                  <FiTrash2 size={20} />
                </button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Projects;