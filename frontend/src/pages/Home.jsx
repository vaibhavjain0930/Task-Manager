import Siderbar from "../components/Home/Siderbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[98vh] gap-4 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 w-[75%] max-w-[280px] bg-gray-900 p-4
          flex flex-col justify-between border-r border-gray-500
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-[25%] md:max-w-none md:rounded md:border md:border-gray-500 md:h-[98vh]
        `}
      >
        {/* Close button (mobile only) */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <RxCross2 />
        </button>
        <Siderbar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="mainsection border rounded w-full p-3 md:p-4 border-gray-500 overflow-y-auto">
        {/* Hamburger button (mobile only) */}
        <button
          className="md:hidden mb-3 p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <RxHamburgerMenu className="text-xl" />
        </button>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
