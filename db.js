// db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI; // Define esta variable en Vercel
let client;
let clientPromise;

if (!uri) {
  throw new Error("Por favor define MONGO_URI en las variables de entorno");
}

if (!client) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export { clientPromise };