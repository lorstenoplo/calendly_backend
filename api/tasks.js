import express from "express";
import connectToDatabase from "../utils/connectToDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/tasks", authMiddleware, async (req, res) => {
  const { task, userId } = req.body;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");

  try {
    const savedTask = await db.collection("tasks").insertOne({
      userId,
      start: task.start,
      end: task.end,
      title: task.title,
    });

    res.status(201).json({ _id: savedTask.insertedId, ...task });
  } catch (error) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

router.get("/tasks", authMiddleware, async (req, res) => {
  const { userId } = req.query;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");

  const userTasksCursor = await db.collection("tasks").find({ userId });
  const userTasks = await userTasksCursor.toArray();

  res.status(200).json(userTasks);
});

export default router;
