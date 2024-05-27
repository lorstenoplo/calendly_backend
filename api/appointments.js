import express from "express";
import { v4 as uuidv4 } from "uuid";
import connectToDatabase from "../utils/connectToDb.js";
const router = express.Router();

const users = [];

router.post("/random-user", (req, res) => {
  const { name } = req.body;
  const user = { id: users.length + 1, name };
  users.push(user);
  res.status(201).json(user);
});

router.post("/appointments", async (req, res) => {
  const { userId, recipientId, appointment } = req.body;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");

  const appointmentId = uuidv4();
  const newAppointment = { id: appointmentId, ...appointment };

  const newTaskForUser = {
    userId,
    title: "Appointment",
    ...appointment,
    appointmentId,
  };

  const newTaskForRecipient = {
    userId: parseInt(recipientId),
    title: "Appointment",
    ...appointment,
    appointmentId,
  };

  try {
    // Insert new appointment
    await db.collection("appointments").insertOne(newAppointment);

    // Insert tasks for both user and recipient
    await db
      .collection("tasks")
      .insertMany([newTaskForUser, newTaskForRecipient]);

    res
      .status(201)
      .json({ newAppointment, tasks: [newTaskForUser, newTaskForRecipient] });
  } catch (error) {
    res.status(500).json({ error: "Failed to save appointment and tasks" });
  }
});

export default router;
