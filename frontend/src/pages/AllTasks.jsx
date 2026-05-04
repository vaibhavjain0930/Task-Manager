import Card from "../components/Home/Card";
import InputData from "../components/Home/InputData";
import NavBar from "../components/Home/NavBar";
import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";

const Alltasks = () => {
  const [InputDiv, setInputDiv] = useState("hidden");

  const [Data, setData] = useState();

  const [Updated, setUpdated] = useState({ id: "", title: "", desc: "" });

  const fetchTasks = useCallback(async () => {
    const response = await api.get("/api/v2/alltasks");
    setData(response.data.data);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <>
      <div>
        <NavBar add={"true"} setInputDiv={setInputDiv} />
        {Data && (
          <Card
            home={"true"}
            setInputDiv={setInputDiv}
            data={Data.tasks}
            setUpdated={setUpdated}
            onTaskChanged={fetchTasks}
          />
        )}
      </div>
      <InputData
        InputDiv={InputDiv}
        setInputDiv={setInputDiv}
        Updated={Updated}
        setUpdated={setUpdated}
        onTaskSaved={fetchTasks}
      />
    </>
  );
};

export default Alltasks;
