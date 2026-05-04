import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupImage from "../assets/signUp.webp";
import { useSelector } from "react-redux";
import { api } from "../utils/api";

const Signup = () => {
  const history = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (isLoggedIn) {
      history(role === "admin" ? "/dashboard" : "/");
    }
  }, [history, isLoggedIn, role]);

  const [Data, setData] = useState({
    username: "",
    email: "",
    password: "",
    role: "member",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    if (Data.username === "" || Data.email === "" || Data.password === "") {
      alert("All Fields are required!");
    } else {
      try {
        const response = await api.post("/api/v1/sign-in", Data);
        if (response.status === 200) {
          localStorage.setItem("lastSignupRole", Data.role);
          setData({ username: "", email: "", password: "", role: "member" });
          console.log("Sign-in successful", response.data);
          history("/login", { state: { role: Data.role } });
        } else {
          console.log("Unexpected response", response);
        }
      } catch (error) {
        alert(error.response?.data?.message || "An error occurred during sign-up. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[98vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:h-[75%] rounded overflow-hidden shadow-xl">
        <div className="hidden md:block md:w-1/2">
          <img src={SignupImage} className="object-cover w-[90%] h-[100%]" />
        </div>
        <div className="w-full md:w-1/2 bg-slate-800 p-8 rounded flex flex-col justify-center items-start gap-8">
          <h1 className="text-2xl font-bold uppercase">Sign-Up</h1>
          <div className="w-full">
            <input
              type="text"
              className="px-3 py-2 rounded bg-transparent border border-gray-500 w-full focus:border-blue-500 transition-all mb-6 duration-300 outline-none"
              placeholder="Enter username..."
              name="username"
              value={Data.username}
              onChange={change}
            />
            <select
              name="role"
              className="px-3 py-2 rounded bg-slate-800 border border-gray-500 w-full focus:border-blue-500 transition-all duration-300 outline-none mb-6"
              value={Data.role}
              onChange={change}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="email"
              className="px-3 py-2 rounded bg-transparent border border-gray-500 w-full focus:border-blue-500 transition-all duration-300 outline-none mb-6"
              placeholder="Enter e-mail..."
              name="email"
              value={Data.email}
              onChange={change}
            />
            <input
              type="text"
              className="px-3 py-2 rounded bg-transparent border border-gray-500 w-full focus:border-blue-500 transition-all duration-300 outline-none"
              placeholder="Enter password"
              name="password"
              value={Data.password}
              onChange={change}
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button
              className="px-4 py-2 bg-slate-500 rounded w-full sm:w-52 text-lg font-semibold hover:bg-blue-500 duration-300 transition-all"
              onClick={submit}
            >
              Sign Up
            </button>
            <p className="text-sm text-gray-400">
              Already having account ?{" "}
              <Link
                to="/login"
                className="underline text-blue-400 hover:text-blue-500 duration-150 transition-all"
              >
                {" "}
                Login here...{" "}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
