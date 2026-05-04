const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();
require("./connection/connection");

const cors = require("cors");

const userApi = require("./routes/user");
const taskApi = require("./routes/task");
const projectApi = require("./routes/project");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1", userApi);
app.use("/api/v2", taskApi);
app.use("/api/v3", projectApi);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(port, () => {
  console.log("Server is running successfully on port : " + port);
});
