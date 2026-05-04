import { CgNotes } from "react-icons/cg";
import { MdLabelImportantOutline } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa";
import { TbNotesOff } from "react-icons/tb";
import { MdDashboard, MdGroups, MdWorkspaces } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../store/auth";
import { useEffect, useState } from "react";
import ProfileImage from "../../assets/profile.avif";
import { api } from "../../utils/api";

const Siderbar = () => {
  const role = useSelector((state) => state.auth.role);
  const data = [
    {
      title: "Dashboard",
      icon: <MdDashboard />,
      link: "/dashboard",
    },
    {
      title: "Projects",
      icon: <MdWorkspaces />,
      link: "/projects",
    },
    {
      title: "All tasks",
      icon: <CgNotes />,
      link: "/",
    },
    {
      title: "Important tasks",
      icon: <MdLabelImportantOutline />,
      link: "/importanttasks",
    },
    {
      title: "Completed tasks",
      icon: <FaCheckDouble />,
      link: "/completedtasks",
    },
    {
      title: "Incomplete tasks",
      icon: <TbNotesOff />,
      link: "/incompletetasks",
    },
  ];

  if (role === "admin") {
    data.push({
      title: "Team",
      icon: <MdGroups />,
      link: "/team",
    });
  }

  const dispatch = useDispatch();
  const history = useNavigate();
  const logout = () => {
    dispatch(authAction.logout());
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    history("/login");
  };

  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await api.get("/api/v2/alltasks");
      setData(response.data.data);
    };

    fetch();
  }, []);

  return (
    <>
      {Data && (
        <div className="flex flex-col items-center border-b-[2px] border-gray-500">
          <div className="w-[7rem] h-[7rem] rounded-full mb-4 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={ProfileImage}
              alt="img"
            />
          </div>
          <h2 className="text-xl font-semibold">{Data.username}</h2>
          <h4 className="mb-1 text-gray-400">{Data.email}</h4>
          <span className="mb-4 rounded bg-gray-700 px-3 py-1 text-xs uppercase text-gray-300">
            {Data.role}
          </span>
          <hr />
        </div>
      )}
      <div>
        {data.map((item, i) => (
          <Link
            className="my-2 cursor-pointer flex items-center gap-2 hover:bg-gray-700 p-2 rounded transition-all duration-300 hover:pl-4"
            key={i}
            to={item.link}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
      <div>
        <button
          className="p-2 bg-gray-600 w-full rounded hover:bg-blue-500 duration-200 transition-all font-semibold"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </>
  );
};

export default Siderbar;
