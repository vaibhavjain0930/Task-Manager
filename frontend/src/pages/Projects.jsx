import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../utils/api";

const Projects = () => {
  const role = useSelector((state) => state.auth.role);
  const [Projects, setProjects] = useState([]);
  const [Form, setForm] = useState({ name: "", description: "" });
  const [Error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await api.get("/api/v3/projects");
      setProjects(response.data.data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    if (!Form.name) {
      alert("Project name is required!");
      return;
    }
    try {
      await api.post("/api/v3/projects", Form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to create project");
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold uppercase text-gray-500">
        Projects
      </h1>
      {role === "admin" && (
        <div className="mb-6 flex flex-col sm:grid sm:grid-cols-[1fr_2fr_auto] gap-3 px-4">
          <input
            className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-blue-500"
            placeholder="Project name"
            value={Form.name}
            onChange={(e) => setForm({ ...Form, name: e.target.value })}
          />
          <input
            className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-blue-500"
            placeholder="Description"
            value={Form.description}
            onChange={(e) => setForm({ ...Form, description: e.target.value })}
          />
          <button
            className="rounded bg-green-600 px-4 py-2 font-semibold"
            onClick={createProject}
          >
            Create
          </button>
        </div>
      )}
      {Error && <p className="px-4 text-center text-red-300">{Error}</p>}
      {!Error && Projects.length === 0 ? (
        <div className="mx-4 rounded border border-gray-700 bg-gray-800 p-8 text-center text-gray-400">
          {role === "admin" ? "No projects created" : "No project assigned"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {Projects.map((project) => (
            <div
              key={project._id}
              className="rounded border border-gray-700 bg-gray-800 p-4"
            >
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="mt-2 text-sm text-gray-400">
                {project.description || "No description provided"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="rounded bg-gray-700 px-2 py-1">
                  Assigned by {project.owner?.username || "Admin"} (
                  {project.owner?.role || "admin"})
                </span>
                <span className="rounded bg-gray-700 px-2 py-1">
                  {project.members?.length || 0} members
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
