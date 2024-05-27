import express from "express";
import connectToDatabase from "../utils/connectToDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ObjectId } from "mongodb";
import dontenv from "dotenv";

dontenv.config();

const router = express.Router();

router.post("/availability", authMiddleware, async (req, res) => {
  const { slots } = req.body;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");

  try {
    await db
      .collection("availability")
      .updateOne(
        { userId: req.user._id },
        { $set: { slots } },
        { upsert: true }
      );
    res.status(201).json({ userId: req.user._id, slots });
  } catch (error) {
    res.status(500).json({ error: "Failed to update availability" });
  }
});

router.get("/availability", async (req, res) => {
  const { userId } = req.query;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");

  try {
    const userAvailability = await db
      .collection("availability")
      .findOne({ userId: new ObjectId(userId) });
    const allavailability = await db
      .collection("availability")
      .find()
      .toArray();
    
    res.status(200).json(userAvailability ? userAvailability.slots : []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

export default router;
