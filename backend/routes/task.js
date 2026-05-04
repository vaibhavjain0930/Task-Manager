const router = require("express").Router();
const Task = require("../Models/task");
const User = require("../Models/user");
const Project = require("../Models/project");
const { authenticationToken, authorizeRoles } = require("./auth");

const getTaskQuery = (req, extra = {}) => {
  if (req.user.role === "admin") {
    return extra;
  }
  return { ...extra, assignedTo: req.user._id };
};

const ensureCanAccessTask = async (req, taskId) => {
  const task = await Task.findById(taskId);
  if (!task) return null;
  if (
    req.user.role !== "admin" &&
    task.assignedTo?.toString() !== req.user._id.toString()
  ) {
    return false;
  }
  return task;
};

// route to create a new task
router.post(
  "/create",
  authenticationToken,
  authorizeRoles("admin"),
  async (req, res) => {
  try {
    const {
      title,
      desc,
      project,
      assignedTo,
      dueDate,
      status = "todo",
    } = req.body;
    if (!title || !assignedTo) {
      return res
        .status(400)
        .json({ message: "Title and assigned member are required!" });
    }

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ message: "Assigned user not found!" });
    }

    if (project) {
      const existingProject = await Project.findById(project);
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found!" });
      }
    }

    const newtask = new Task({
      title,
      desc,
      project: project || undefined,
      assignedTo,
      createdBy: req.user._id,
      dueDate: dueDate || undefined,
      status,
      complete: status === "completed",
    });
    const savetask = await newtask.save();
    await User.findByIdAndUpdate(assignedTo, { $push: { tasks: savetask._id } });
    if (project) {
      await Project.findByIdAndUpdate(project, {
        $addToSet: { members: assignedTo },
      });
    }
    res.status(200).json({ message: "task created !" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server issue!" });
  }
  }
);

// route of get all the create tasks
router.get("/alltasks", authenticationToken, async (req, res) => {
  try {
    const tasks = await Task.find(getTaskQuery(req))
      .populate("assignedTo", "username email role")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: {
        ...req.user.toObject(),
        tasks,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Internal server issue!" });
  }
});

// route to delete a specific task
router.delete("/delete/:id", authenticationToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks!" });
    }
    const { id } = req.params;
    const delTask = await Task.findByIdAndDelete(id);

    if (delTask?.assignedTo) {
      await User.findByIdAndUpdate(delTask.assignedTo, {
      $pull: { tasks: id },
    });
    }

    return res.status(200).json({ deletedTask: delTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server issue!" });
  }
});

// route to upadate the content of task
router.put("/update/:id", authenticationToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update tasks!" });
    }
    const { id } = req.params;
    const { title, desc, assignedTo, project, dueDate, status } = req.body;
    const previousTask = await Task.findById(id);
    if (!previousTask) {
      return res.status(404).json({ message: "Task not found!" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        desc,
        assignedTo,
        project: project || undefined,
        dueDate: dueDate || undefined,
        status,
        complete: status === "completed",
      },
      { new: true }
    );

    if (
      assignedTo &&
      previousTask.assignedTo?.toString() !== assignedTo.toString()
    ) {
      await User.findByIdAndUpdate(previousTask.assignedTo, {
        $pull: { tasks: id },
      });
      await User.findByIdAndUpdate(assignedTo, { $addToSet: { tasks: id } });
    }
    if (project && assignedTo) {
      await Project.findByIdAndUpdate(project, {
        $addToSet: { members: assignedTo },
      });
    }
    res
      .status(200)
      .json({ message: "Task update successfully!", UpdatedTask: updatedTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Issue!" });
  }
});

// route to prioritize tasks on based of their importance
router.put("/update-imp/:id", authenticationToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can mark important tasks!" });
    }
    const { id } = req.params;
    const taskData = await Task.findById(id);
    const impoTask = taskData.important;
    await Task.findByIdAndUpdate(id, { important: !impoTask });
    res.status(200).json({ message: "Update successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server issue!" });
  }
});

// route to mark a check on tasks if they are complete or not
router.put("/update-complete/:id", authenticationToken, async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = await ensureCanAccessTask(req, id);
    if (!taskData) {
      return res.status(404).json({ message: "Task not found!" });
    }
    if (taskData === false) {
      return res.status(403).json({ message: "Task is not assigned to you!" });
    }
    const completeTask = taskData.complete;
    await Task.findByIdAndUpdate(id, {
      complete: !completeTask,
      status: !completeTask ? "completed" : "todo",
    });
    res.status(200).json({ message: "Update successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server issue!" });
  }
});

router.put("/update-status/:id", authenticationToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["todo", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid task status!" });
    }
    const taskData = await ensureCanAccessTask(req, req.params.id);
    if (!taskData) {
      return res.status(404).json({ message: "Task not found!" });
    }
    if (taskData === false) {
      return res.status(403).json({ message: "Task is not assigned to you!" });
    }
    await Task.findByIdAndUpdate(req.params.id, {
      status,
      complete: status === "completed",
    });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server issue!" });
  }
});

// route to get all the important tasks
router.get("/important-tasks", authenticationToken, async (req, res) => {
  try {
    const impo_task = await Task.find(getTaskQuery(req, { important: true }))
      .populate("assignedTo", "username email role")
      .populate("project", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: impo_task });
  } catch (error) {
    res.status(400).json({ message: "Internal server issue!" });
  }
});

// route to get all the complete tasks
router.get("/complete-tasks", authenticationToken, async (req, res) => {
  try {
    const complete_task = await Task.find(
      getTaskQuery(req, { complete: true })
    )
      .populate("assignedTo", "username email role")
      .populate("project", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: complete_task });
  } catch (error) {
    res.status(400).json({ message: "Internal server issue!" });
  }
});

// route to get all the Incomplete tasks
router.get("/incomplete-tasks", authenticationToken, async (req, res) => {
  try {
    const Incomplete_task = await Task.find(
      getTaskQuery(req, { complete: false })
    )
      .populate("assignedTo", "username email role")
      .populate("project", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: Incomplete_task });
  } catch (error) {
    res.status(400).json({ message: "Internal server issue!" });
  }
});

module.exports = router;
