import { useEffect, useState } from "react";
import { api } from "../utils/api";

const Team = () => {
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get("/api/v1/users");
      setUsers(response.data.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold uppercase text-gray-500">
        Team
      </h1>
      <div className="p-4">
        <div className="overflow-hidden rounded border border-gray-700">
          {Users.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-3 border-b border-gray-700 bg-gray-800 p-4 last:border-b-0"
            >
              <span className="font-semibold">{user.username}</span>
              <span className="text-gray-400">{user.email}</span>
              <span className="text-right uppercase text-gray-300">{user.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
