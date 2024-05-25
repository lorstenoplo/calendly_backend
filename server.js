const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

let users = [];
let tasks = [];
let availability = [];
let appointments = [];

app.post("/api/users", (req, res) => {
  const { name } = req.body;
  const user = { id: users.length + 1, name };
  users.push(user);
  res.status(201).json(user);
});

app.get("/api/user", (req, res) => {
  const { id } = req.query;
  const user = users.find((user) => user.id === parseInt(id, 10));
  if (!user) {
    res.json({ message: "User not found", user: null });
  }
  res.status(200).json({ user: user });
});

app.post("/api/tasks", (req, res) => {
  const { userId, task } = req.body;
  const newTask = { id: tasks.length + 1, userId, ...task };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get("/api/tasks", (req, res) => {
  const { userId } = req.query;
  const userTasks = tasks.filter(
    (task) => task.userId === parseInt(userId, 10)
  );
  res.status(200).json(userTasks);
});

app.post("/api/availability", (req, res) => {
  const { userId, slots } = req.body;
  const userAvailability = { userId, slots };
  availability = availability.filter((a) => a.userId !== userId);
  availability.push(userAvailability);
  res.status(201).json(userAvailability);
});

app.get("/api/availability", (req, res) => {
  const { userId } = req.query;
  const userAvailability = availability.find(
    (a) => a.userId === parseInt(userId, 10)
  );
  res.status(200).json(userAvailability ? userAvailability.slots : []);
});

app.post("/api/appointments", (req, res) => {
  const { userId, recipientId, appointment } = req.body;
  const appointmentId = uuidv4();
  const newAppointment = { id: appointmentId, ...appointment };
  appointments.push(newAppointment);

  const newTaskForUser = {
    id: tasks.length + 1,
    userId,
    title: "Appointment",
    ...appointment,
    appointmentId,
  };
  tasks.push(newTaskForUser);

  const newTaskForRecipient = {
    id: tasks.length + 1,
    userId: recipientId,
    title: "Appointment",
    ...appointment,
    appointmentId,
  };
  tasks.push(newTaskForRecipient);

  res.status(201).json(newAppointment);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
