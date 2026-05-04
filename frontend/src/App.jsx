import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import AllTasks from "./pages/AllTasks";
import ImportantTasks from "./pages/ImportantTasks";
import CompleteTasks from "./pages/CompleteTasks";
import IncompleteTasks from "./pages/IncompleteTasks";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { authAction } from "./store/auth";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const isPublicPage = ["/login", "/signup"].includes(location.pathname);

    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      dispatch(authAction.login({ role: localStorage.getItem("role") }));
    } else if (isLoggedIn === false && !isPublicPage) {
      navigate("/login");
    }
  }, [dispatch, isLoggedIn, location.pathname, navigate]);
  return (
    <>
      <div className="text-white bg-gray-900 w-full min-h-screen p-2 relative">
        <Routes>
          {/* these are the nested roots  */}
          <Route exact path="/" element={<Home />}>
            <Route index element={<AllTasks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team" element={<Team />} />
            <Route path="/importanttasks" element={<ImportantTasks />} />
            <Route path="/incompletetasks" element={<IncompleteTasks />} />
            <Route path="/completedtasks" element={<CompleteTasks />} />
          </Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
