import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { version } from "./version";
import errorHandler from "./middleware/error-handler";
import notFoundHandler from "./middleware/not-found-handler";
import jwtHandler from "./middleware/jwt-handler";
import mongoDbDatabase from "./services/mongodb-service";

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

  await mongoDbDatabase.collection("chats").insertOne(chat);
  res.send(chat);
});



app.use(notFoundHandler);

app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
