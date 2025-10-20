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
import { MessageEntity } from "./entities/message-entity";
import { Message } from "./models/message";
import messageValidator from "./validators/message-validator";



const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", version: version });
});

app.use(jwtHandler);


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
    if (!ObjectId.isValid(id)) {
        res.status(400).send({message: 'Invalid ID'})
    return
  }

  const entity = await mongoDbDatabase.collection<ChatEntity>("chats").findOne({_id: id, isArchived: false, userEmail: req.auth!["https://bcs-api/email"]!})

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


app.get('/api/chats', async (req, res)=>{

  const userEmail = req.auth!["https://bcs-api/email"]

  const entities = await mongoDbDatabase.collection<ChatEntity>('chats').find({userEmail: userEmail, isArchived:false}).toArray();

  const chats : Chat[] = entities.map(e => ({
    date: e.date,
    isArchived: e.isArchived,
    title: e.title,
    userEmail: e.userEmail,
    _id: e._id.toString()
  }));

  res.send(chats)

})



app.get('/api/messages/:chatId', async (req, res)=>{

  const chatId = req.params.chatId

  if (!ObjectId.isValid(chatId)) {
        res.status(400).send({message: 'Invalid ID'})
    return
  }

  const userEmail = req.auth!["https://bcs-api/email"]

  const counts = await mongoDbDatabase.collection<ChatEntity>('chats').countDocuments({_id: new ObjectId(chatId), userEmail: userEmail})

  //autorizare

  if( counts === 0 ){
    res.status(403).send({message: 'NO access'})
    return
  }

  const entities = await mongoDbDatabase.collection<MessageEntity>('messages').find({chatId: chatId}).sort({date: 1}).toArray();

  const messages: Message[] = entities.map(m =>({
    chatId: m.chatId,
    date: m.date,
    isFromAi: m.isFromAi,
    text: m.text,
    _id: m._id.toString()
  }));

  res.send(messages)


})


app.post('/api/messages', async (req, res)=>{


const message : Message = req.body
message.date = new Date().getTime();
message.isFromAi = false;

await messageValidator.validate(message)

const chat = await mongoDbDatabase.collection<ChatEntity>('chats').findOne({_id: new ObjectId(message.chatId)})

//autorizare

if(!chat){
  res.status(400).send({message: "Chat is not exist"})
  return
}


if( chat.userEmail !== req.auth!["https://bcs-api/email"] ){
  res.status(403).send({message: "No access"})
  return
}


const entuity: MessageEntity = {
  chatId: message.chatId,
  date: message.date,
  isFromAi: message.isFromAi,
  text: message.text,

}


await mongoDbDatabase.collection<MessageEntity>('messages').insertOne(entuity)

//AI

const aiMessage: Message = {
  chatId: message.chatId,
  text: 'This is from AI',
  date: new Date().getTime(),
  isFromAi: true
};
res.send(aiMessage)



})



app.use(notFoundHandler);

app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
