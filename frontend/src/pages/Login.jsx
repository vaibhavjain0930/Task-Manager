import { useEffect, useState } from "react";
import LoginImage from "../assets/Login.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAction } from "../store/auth";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../utils/api";

const Login = () => {
  const history = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (isLoggedIn) {
      history(role === "admin" ? "/dashboard" : "/");
    }
  }, [history, isLoggedIn, role]);

  const [Data, setData] = useState({
    username: "",
    password: "",
    role: location.state?.role || localStorage.getItem("lastSignupRole") || "member",
  });
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    if (Data.username === "" || Data.password === "") {
      alert("Invalid creadientials!");
    } else {
      try {
        const response = await api.post("/api/v1/log-in", {
          username: Data.username,
          password: Data.password,
        });
        if (response.status === 200) {
          if (response.data.role !== Data.role) {
            alert(`This account is registered as ${response.data.role}. Please select the correct role.`);
            return;
          }
          setData({ username: "", password: "", role: "member" });
          localStorage.setItem("id", response.data.id);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("username", response.data.username);
          localStorage.removeItem("lastSignupRole");
          dispatch(authAction.login({ role: response.data.role }));
          history(response.data.role === "admin" ? "/dashboard" : "/");
        } else {
          console.log("Unexpected response", response);
        }
      } catch (error) {
        alert(error.response?.data?.message || "An error occurred during log-in. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[98vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:h-[75%] rounded overflow-hidden shadow-xl">
        <div className="hidden md:block md:w-1/2">
          <img src={LoginImage} className="object-cover w-[90%] h-[100%]" />
        </div>
        <div className="w-full md:w-1/2 bg-slate-800 p-8 rounded flex flex-col justify-center items-start gap-8">
          <h1 className="text-2xl font-bold uppercase">Log-in</h1>
          <div className="w-full">
            <input
              type="username"
              className="px-3 py-2 rounded bg-transparent border border-gray-500 w-full focus:border-blue-500 transition-all duration-300 outline-none mb-6"
              placeholder="Enter username..."
              name="username"
              value={Data.username}
              onChange={change}
            />
            <input
              type="password"
              className="px-3 py-2 rounded bg-transparent border border-gray-500 w-full focus:border-blue-500 transition-all duration-300 outline-none"
              placeholder="Enter password"
              name="password"
              value={Data.password}
              onChange={change}
            />
            <select
              name="role"
              className="px-3 py-2 rounded bg-slate-800 border border-gray-500 w-full focus:border-blue-500 transition-all duration-300 outline-none mt-6"
              value={Data.role}
              onChange={change}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button
              className="px-4 py-2 bg-slate-500 rounded w-full sm:w-52 text-lg font-semibold hover:bg-blue-500 duration-300 transition-all"
              onClick={submit}
            >
              Login
            </button>
            <p className="text-sm text-gray-400">
              Not having an account ?{" "}
              <Link
                to="/signup"
                className="text-blue-400 underline hover:text-blue-500 duration-150 transition-all"
              >
                Signup here...{" "}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
