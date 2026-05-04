/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const emptyTaskForm = {
  title: "",
  desc: "",
  assignedTo: "",
  project: "",
  status: "todo",
  dueDate: "",
};

const InputData = ({
  InputDiv,
  setInputDiv,
  Updated,
  setUpdated,
  onTaskSaved,
}) => {
  const [Data, setData] = useState({
    ...emptyTaskForm,
  });
  const [Users, setUsers] = useState([]);
  const [Projects, setProjects] = useState([]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      title: Updated.title || "",
      desc: Updated.desc || "",
      assignedTo: Updated.assignedTo || "",
      project: Updated.project || "",
      status: Updated.status || "todo",
      dueDate: Updated.dueDate || "",
    }));
  }, [Updated]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          api.get("/api/v1/users"),
          api.get("/api/v3/projects"),
        ]);
        setUsers(usersResponse.data.data.filter((user) => user.role === "member"));
        setProjects(projectsResponse.data.data);
      } catch (error) {
        console.log(error.response?.data?.message || "Admin data unavailable");
      }
    };
    fetchAdminData();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const handleCreateTask = async () => {
    if (Data.title === "" || Data.desc === "" || Data.assignedTo === "") {
      alert("Title, description, and assigned member are required!");
    } else {
      try {
        await api.post("/api/v2/create", Data);
        setData({ ...emptyTaskForm });
        setInputDiv("hidden");
        onTaskSaved?.();
      } catch (error) {
        alert(error.response?.data?.message || "Unable to create task");
      }
    }
  };

  const handleUpdatedTask = async () => {
    if (Data.title === "" || Data.desc === "" || Data.assignedTo === "") {
      alert("Title, description, and assigned member are required!");
    } else {
      try {
        await api.put(`/api/v2/update/${Updated.id}`, Data);
        setUpdated({ id: "", title: "", desc: "" });
        setData({ ...emptyTaskForm });
        setInputDiv("hidden");
        onTaskSaved?.();
      } catch (error) {
        alert(error.response?.data?.message || "Unable to update task");
      }
    }
  };

  return (
    <>
      <div
        className={`w-full h-screen bg-gray-800 top-0 left-0 opacity-[70%] ${InputDiv} `}
      ></div>
      <div
        className={`w-full h-screen flex items-center justify-center top-0 left-0 ${InputDiv} `}
      >
        <div className="w-[35%] bg-gray-800 h-[90%] rounded border border-gray-500 py-8 px-10 flex justify-between flex-col relative">
          <button
            onClick={() => {
              setInputDiv("hidden");
              setData({ ...emptyTaskForm });
              setUpdated({ id: "", title: "", desc: "" });
            }}
            className="absolute right-8 top-6 "
          >
            <RxCross2 className="text-2xl font-bold hover:scale-[1.2] duration-200 transition-all cursor-pointer" />
          </button>
          <h1 className="text-center text-gray-400 text-2xl font-bold">
            {Updated.id === "" ? "Add New Task" : "Update Task"}
          </h1>
          <input
            type="text"
            placeholder="Title"
            name="title"
            className="px-3 py-2 rounded bg-transparent border border-gray-500 w-full focus:border-blue-500 transition-all duration-300 outline-none"
            value={Data.title}
            onChange={change}
          />
          <textarea
            name="desc"
            placeholder="Description..."
            className="px-3 py-2 rounded bg-transparent border border-gray-500 w-full h-[28%] resize-none focus:border-blue-500 outline-none transition-all duration-300"
            value={Data.desc}
            onChange={change}
          ></textarea>
          <select
            name="assignedTo"
            className="px-3 py-2 rounded bg-gray-900 border border-gray-500 w-full focus:border-blue-500 outline-none transition-all duration-300"
            value={Data.assignedTo}
            onChange={change}
          >
            <option value="">Assign to member</option>
            {Users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
          <select
            name="project"
            className="px-3 py-2 rounded bg-gray-900 border border-gray-500 w-full focus:border-blue-500 outline-none transition-all duration-300"
            value={Data.project}
            onChange={change}
          >
            <option value="">No project</option>
            {Projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <select
              name="status"
              className="px-3 py-2 rounded bg-gray-900 border border-gray-500 w-1/2 focus:border-blue-500 outline-none transition-all duration-300"
              value={Data.status}
              onChange={change}
            >
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="date"
              name="dueDate"
              className="px-3 py-2 rounded bg-transparent border border-gray-500 w-1/2 focus:border-blue-500 transition-all duration-300 outline-none"
              value={Data.dueDate}
              onChange={change}
            />
          </div>
          {Updated.id === "" ? (
            <button
              className="px-3 py-2 bg-gray-500 text-xl font-semibold rounded hover:bg-green-600 duration-300 transition-all"
              onClick={handleCreateTask}
            >
              Create Task
            </button>
          ) : (
            <button
              className="px-3 py-2 bg-gray-500 text-xl font-semibold rounded hover:bg-yellow-600 duration-300 transition-all"
              onClick={handleUpdatedTask}
            >
              Update Task
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default InputData;
