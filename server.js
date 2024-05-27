import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./api/auth.js";
import tasksRoutes from "./api/tasks.js";
import availabilityRoutes from "./api/availability.js";
import appointmentsRoutes from "./api/appointments.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", tasksRoutes);
app.use("/api", availabilityRoutes);
app.use("/api", appointmentsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
