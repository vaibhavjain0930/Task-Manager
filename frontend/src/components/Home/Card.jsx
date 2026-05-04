/* eslint-disable react/prop-types */
import { CiHeart } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { api } from "../../utils/api";

const Card = ({ home, setInputDiv, data, setUpdated, onTaskChanged }) => {
  const role = useSelector((state) => state.auth.role);
  const isAdmin = role === "admin";

  const handleCompleteTask = async (id) => {
    try {
      await api.put(`/api/v2/update-complete/${id}`, {});
      onTaskChanged?.();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update task");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/v2/update-status/${id}`, { status });
      onTaskChanged?.();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update status");
    }
  };

  const handleImpTask = async (id) => {
    try {
      const response = await api.put(`/api/v2/update-imp/${id}`, {});
      if (response) console.log("Added to important");
      onTaskChanged?.();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/api/v2/delete/${id}`);
      if (response) console.log("Delete Task");
      onTaskChanged?.();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete task");
    }
  };

  const handleUpdateTask = async (task) => {
    try {
      setInputDiv("fixed");
      setUpdated({
        id: task._id,
        title: task.title,
        desc: task.desc || "",
        assignedTo: task.assignedTo?._id || "",
        project: task.project?._id || "",
        status: task.status || (task.complete ? "completed" : "todo"),
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Unable to open task");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {(!data || data.length === 0) && (
        <div className="col-span-3 rounded border border-gray-700 bg-gray-800 p-8 text-center text-gray-400">
          No data
        </div>
      )}
      {data &&
        data.map((item, key) => (
          <div
            key={key}
            className="border-[1.5px] border-gray-900 bg-gray-800  rounded p-3 hover:bg-gray-700 duration-300 transition-all hover:scale-105 hover:border-gray-500 flex flex-col justify-between"
          >
            <div>
              <h1 className="text-xl font-semibold">{item.title}</h1>
              <p className="text-gray-400 text-sm my-2">{item.desc}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                {item.project?.name && (
                  <span className="rounded bg-gray-700 px-2 py-1">
                    {item.project.name}
                  </span>
                )}
                {item.assignedTo?.username && (
                  <span className="rounded bg-gray-700 px-2 py-1">
                    {item.assignedTo.username}
                  </span>
                )}
                {item.dueDate && (
                  <span className="rounded bg-gray-700 px-2 py-1">
                    Due {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <button
                className={`px-4 py-1 rounded w-3/6 ${
                  item.complete === false ? "bg-red-400" : "bg-green-600"
                }`}
                onClick={() => handleCompleteTask(item._id)}
              >
                {item.complete === true ? "Completed" : "In-Complete"}
              </button>
              <select
                className="mx-2 w-3/6 rounded bg-gray-900 px-2 py-1 text-sm text-gray-200"
                value={item.status || (item.complete ? "completed" : "todo")}
                onChange={(e) => handleStatusChange(item._id, e.target.value)}
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="w-3/6 text-xl flex justify-around text-gray-500">
                {isAdmin && (
                  <button
                    className="hover:text-gray-200 duration-200 transition-all text-[1.6rem]"
                    onClick={() => handleImpTask(item._id)}
                  >
                    {item.important === false ? (
                      <CiHeart />
                    ) : (
                      <FaHeart className="text-red-500" />
                    )}
                  </button>
                )}
                {isAdmin && home !== "false" && (
                  <button
                    className="hover:text-gray-200 duration-200 transition-all"
                    onClick={() => {
                      handleUpdateTask(item);
                    }}
                  >
                    <FaRegEdit />
                  </button>
                )}
                {isAdmin && (
                  <button
                    className="hover:text-gray-200 duration-200 transition-all text-[1.6rem]"
                    onClick={() => handleDelete(item._id)}
                  >
                    <MdDeleteOutline />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

      {home === "true" && isAdmin && (
        <button
          onClick={() => {
            setInputDiv("fixed");
          }}
          className="border-[1.5px] border-gray-900 bg-gray-800  rounded p-3 hover:bg-gray-700 duration-300 transition-all hover:scale-105 hover:border-gray-500 flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-white"
        >
          <IoAddCircle className="text-5xl" />
          <h2 className="text-xl font-semibold uppercase">Add Task</h2>
        </button>
      )}
    </div>
  );
};

export default Card;
