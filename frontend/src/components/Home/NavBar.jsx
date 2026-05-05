import { IoAddCircle } from "react-icons/io5";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const NavBar = ({ add, setInputDiv }) => {
  const role = useSelector((state) => state.auth.role);
  const canCreateTask = add === "true" && role === "admin";

  return (
    <div>
      <div className="w-full flex justify-between px-3 items-center relative">
        <h1 className="text-gray-500 text-lg sm:text-[1.5rem] font-bold uppercase text-center w-full">
          Task Manager
        </h1>
        {canCreateTask && (
          <button onClick={() => setInputDiv("fixed")}>
            <IoAddCircle className="text-3xl sm:text-4xl text-gray-500 absolute top-0 right-2 hover:text-green-500 duration-150 transition-all hover:scale-[1.3]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
