


const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const Task = require("../models/taskModel");

// Route to create a new task
router.post("/tasks", authenticateUser, async (req, res) => {
  try {
    const { title, priority, checklist, dueDate } = req.body;
    const createdBy = req.user._id;
    const task = new Task({ title, priority, checklist, dueDate, createdBy });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Route to fetch all tasks
router.get("/tasks", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// PUT /tasks/:taskId
router.put("/tasks/:taskId", authenticateUser, async (req, res) => {
  try {
    console.log("editing");
    const taskId = req.params.taskId;
    const { title, priority, checklist, dueDate } = req.body;
    console.log(taskId);
    const updatedTask = {
      title,
      priority,
      checklist,
      dueDate,
      _id: taskId,
    };

    // Update the task's isChecked status in the database
    const task = await Task.findByIdAndUpdate(taskId, updatedTask);
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// PUT route to update task status
router.put("/tasks/:taskId/status", async (req, res) => {
  const taskId = req.params.taskId;
  const { status } = req.body;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update the task status
    task.status = status;

    // Save the updated task
    await task.save();

    res.json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a task by ID
router.delete("/tasks/:id", authenticateUser, async (req, res) => {
  try {
    const taskId = req.params.id;
    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});


// Route to get task details by ID
router.get('/tasks/:taskId', authenticateUser, async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Find the task by ID in the database
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
      res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task details' });
  }
});



module.exports = router;