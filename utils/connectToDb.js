import url from "url";
import { MongoClient } from "mongodb";
import dontenv from "dotenv";

// Load the environment variables from the .env file
dontenv.config();

// Create cached connection variable
let cachedDb = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
const connectToDatabase = async (uri) => {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri);

  // Select the database through the connection,
  // using the database path of the connection string
  const db = client.db((url.parse(uri).pathname || "").substr(1));

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
};

export default connectToDatabase;
