import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { version } from "./version";
import errorHandler from "./middleware/error-handler";
import notFoundHandler from "./middleware/not-found-handler";
import jwtHandler from "./middleware/jwt-handler";
import mongoDbDatabase from "./services/mongodb-service";
import { Chat } from "./models/chat";
import { ChatEntity } from "./entities/chat-entity";
import { ObjectId } from "mongodb";

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", version: version });
});



app.use(
  jwtHandler
);


app.post("/api/chat/new", async (req, res) => {
  
  const chat: ChatEntity = {
    isArchived: false,
    date: new Date().getTime(),
    title: "New Chat",
    userEmail: req.auth!["https://bcs-api/email"],
  };

  await mongoDbDatabase.collection<ChatEntity>("chats").insertOne(chat);
  res.send({
    date: chat.date,
    isArchived: chat.isArchived,
    title: chat.title,
    userEmail:chat.userEmail,
    _id: chat._id?.toString()
  } as Chat);
});




app.get("/api/chat/:id", async (req, res)=>{

  const id = new ObjectId( req.params.id)
 
  const entity = await mongoDbDatabase.collection<ChatEntity>("chats").findOne({_id: id})

  if (!entity) {
    res.status(404).send({message: 'Not found'});
    return;
  }


  const chat : Chat = {
    date: entity.date,
    isArchived: entity.isArchived,
    title: entity.title,
    userEmail: entity.userEmail,
    _id: entity._id.toString()

  } 

  res.send(chat)

})


app.get("/api/messages/:chatId", async (req, res)=>{

})



app.use(notFoundHandler);

app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
