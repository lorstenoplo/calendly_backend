import jwt from "jsonwebtoken";
import connectToDatabase from "../utils/connectToDb.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  //   const token = req.headers["authorization"]?.split(" ")[1];

  const token =
    req.query.token ||
    req.body.token ||
    req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const db = await connectToDatabase(process.env.MONGO_CONNECTION_URL || "");
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(decoded.id) });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
};
