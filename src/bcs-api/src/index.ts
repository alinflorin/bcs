import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { version } from "./version";
import { MongoClient } from "mongodb";
import errorHandler from "./middleware/error-handler";
import notFoundHandler from "./middleware/not-found-handler";
import jwtHandler from "./middleware/jwt-handler";

const url = `mongodb://${
  process.env.MONGODB_USERNAME
    ? process.env.MONGODB_USERNAME + `:` + process.env.MONGODB_PASSWORD + "@"
    : ``
}${process.env.MONGODB_HOSTNAME || "localhost"}:${process.env.MONGODB_PORT || 27017}/${process.env.MONGODB_DATABASE || "bcs"}`;
const client = new MongoClient(url);
const baza = client.db("bcs");

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", version: version });
});

app.use(
  jwtHandler
);


app.post("/api/chat/new", async (req, res) => {
  
  const chat = {
    isArchived: false,
    date: new Date().getTime(),
    title: "New Chat",
    userEmail: req.auth!["https://bcs-api/email"],
  };

  await baza.collection("chats").insertOne(chat);
  res.send(chat);
});



app.use(notFoundHandler);

app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
