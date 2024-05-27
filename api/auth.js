import express from "express";
import bcrypt from "bcryptjs";
import connectToDatabase from "../utils/connectToDb.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const createdAt = Date.now().toString();
  const user = {
    username,
    password: hashedPassword,
    createdAt,
  };
  let savedUser;
  try {
    savedUser = await db.collection("users").insertOne(user);
  } catch (error) {
    res.status(500).json({
      error,
    });
    return;
  }
  const token = generateToken(user);

  res.status(200).json({
    user,
    token,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");
  const user = await db.collection("users").findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = generateToken(user);
  res.status(200).json({ user, token });
});

router.get("/me", async (req, res) => {
  const { token } = req.query;
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");
  const decodedUser = jwt.verify(
    token,
    process.env.JWT_SECRET || "@njkddm#jkim"
  );
  const uid = decodedUser?.id;

  const user = await db.collection("users").findOne({ _id: new ObjectId(uid) });

  if (!user) {
    res.json({
      user: null,
    });
  } else res.json({ user });
});

export default router;
