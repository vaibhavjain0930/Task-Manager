import { useEffect, useState } from "react";
import { api } from "../utils/api";

const Dashboard = () => {
  const [Stats, setStats] = useState();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await api.get("/api/v3/dashboard");
      setStats(response.data.data);
    };
    fetchStats();
  }, []);

  const cards = [
    ["Projects", Stats?.totalProjects || 0],
    ["Tasks", Stats?.totalTasks || 0],
    ["To do", Stats?.todo || 0],
    ["In progress", Stats?.inProgress || 0],
    ["Completed", Stats?.completed || 0],
    ["Overdue", Stats?.overdue || 0],
  ];

  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold uppercase text-gray-500">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded border border-gray-700 bg-gray-800 p-5">
            <p className="text-sm uppercase text-gray-400">{label}</p>
            <h2 className="mt-2 text-4xl font-bold">{value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
