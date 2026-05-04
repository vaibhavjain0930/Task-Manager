import { useCallback, useEffect, useState } from "react";
import Card from "../components/Home/Card";
import NavBar from "../components/Home/NavBar";
import { api } from "../utils/api";

const IncompleteTasks = () => {
  const [Data, setData] = useState();
  const fetchTasks = useCallback(async () => {
    const response = await api.get("/api/v2/incomplete-tasks");
    setData(response.data.data);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <NavBar add={false} />
      <Card home={"false"} data={Data || []} onTaskChanged={fetchTasks} />
    </div>
  );
};

export default IncompleteTasks;
