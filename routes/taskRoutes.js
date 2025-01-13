const express = require("express");
const {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} = require("../controllers/taskController");
const authenticateToken = require("../middleware/authenticateToken");
const validateTask = require("../middleware/validateTask");

const router = express.Router();

router.post("/", authenticateToken, validateTask, createTask);
router.get("/", authenticateToken, getTasks);
router.get("/:id", authenticateToken, getTaskById);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;
