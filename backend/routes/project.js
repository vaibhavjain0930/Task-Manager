const router = require("express").Router();
const Project = require("../Models/project");
const Task = require("../Models/task");
const User = require("../Models/user");
const { authenticationToken, authorizeRoles } = require("./auth");

const getAllowedProjects = async (user) => {
  if (user.role === "admin") {
    return Project.find()
      .populate("owner", "username email role")
      .populate("members", "username email role")
      .sort({ createdAt: -1 });
  }

  return Project.find({ members: user._id })
    .populate("owner", "username email role")
    .populate("members", "username email role")
    .sort({ createdAt: -1 });
};

router.get("/projects", authenticationToken, async (req, res) => {
  try {
    const projects = await getAllowedProjects(req.user);
    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json({ message: "Internal server issue!" });
  }
});

router.post(
  "/projects",
  authenticationToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, description, members = [] } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Project name is required!" });
      }

      const memberIds = [...new Set([req.user._id.toString(), ...members])];
      const project = await Project.create({
        name,
        description,
        owner: req.user._id,
        members: memberIds,
      });

      res.status(201).json({ message: "Project created!", data: project });
    } catch (error) {
      res.status(500).json({ message: "Internal server issue!" });
    }
  }
);

router.put(
  "/projects/:id/members",
  authenticationToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { members = [] } = req.body;
      const validUsers = await User.find({ _id: { $in: members } }).select(
        "_id"
      );
      const memberIds = [
        req.user._id.toString(),
        ...validUsers.map((member) => member._id.toString()),
      ];

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        { members: [...new Set(memberIds)] },
        { new: true }
      )
        .populate("owner", "username email role")
        .populate("members", "username email role");

      if (!project) {
        return res.status(404).json({ message: "Project not found!" });
      }

      res.status(200).json({ message: "Team updated!", data: project });
    } catch (error) {
      res.status(500).json({ message: "Internal server issue!" });
    }
  }
);

router.get("/dashboard", authenticationToken, async (req, res) => {
  try {
    const now = new Date();
    const projects = await getAllowedProjects(req.user);
    const projectIds = projects.map((project) => project._id);
    const taskQuery =
      req.user.role === "admin"
        ? { project: { $in: projectIds } }
        : { assignedTo: req.user._id };
    const tasks = await Task.find(taskQuery);

    const stats = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
      overdue: tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) < now &&
          task.status !== "completed"
      ).length,
    };

    res.status(200).json({ data: stats });
  } catch (error) {
    res.status(500).json({ message: "Internal server issue!" });
  }
});

module.exports = router;
