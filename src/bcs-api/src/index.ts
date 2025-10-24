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
import { UpdateChat } from "./models/updateChat";
import { randomBytes } from 'crypto'




const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", version: version });
});



// public endpoint
app.get('/api/public/:publicId', async (req, res)=>{

  const publicId = req.params.publicId

  const chat = await mongoDbDatabase.collection<ChatEntity>('chats').findOne({publicId, isPublic: true})

  if(!chat){
       res.status(404).send({message: 'Chat not public'})
    return
  }

  const entities = await mongoDbDatabase.collection<MessageEntity>('messages').find({chatId: chat._id.toString()}).sort({date: 1}).toArray()

  const messages: Message[] = entities.map(m => ({
    chatId: m.chatId,
    date: m.date,
    isFromAi: m.isFromAi,
    text: m.text,
    _id: m._id.toString(),
  }))

  res.send({chatTitle: chat.title, messages})


})

app.use(jwtHandler);

// creare link ...
app.post('/api/share/:chatId', async (req, res)=>{

  const chatId = req.params.chatId
  const userEmail = req.auth!["https://bcs-api/email"]

  if (!ObjectId.isValid(chatId)) {
        res.status(400).send({message: 'Invalid ID'})
    return
  }

  const chat = await mongoDbDatabase.collection<ChatEntity>('chats').findOne({_id: new ObjectId(chatId), userEmail: userEmail})

  //autorizare

  if( !chat ){
    res.status(403).send({message: 'NO access'})
    return
  }

    // Generate a random publicId if not already shared
  const publicId = chat.publicId || randomBytes(16).toString('hex')

  await mongoDbDatabase.collection<ChatEntity>('chats').updateOne({_id: chat._id}, {$set: {isPublic: true, publicId: publicId}})

  res.send({publicId: publicId})

})


app.post("/api/chat/new", async (req, res) => {
  
  const chat: ChatEntity = {
    isArchived: false,
    date: new Date().getTime(),
    title: "New Chat",
    userEmail: req.auth!["https://bcs-api/email"],
    ///add here 
    isPublic: false,
    publicId: undefined
  };

  await mongoDbDatabase.collection<ChatEntity>("chats").insertOne(chat);
  res.send({
    date: chat.date,
    isArchived: chat.isArchived,
    title: chat.title,
    userEmail:chat.userEmail,
    _id: chat._id?.toString(),

    ///here too 
    isPublic: chat.isPublic,
    publicId: chat.publicId
  } as Chat);
});



app.get("/api/chat/:id", async (req, res)=>{

  const id = new ObjectId( req.params.id)
    if (!ObjectId.isValid(id)) {
        res.status(400).send({message: 'Invalid ID'})
    return
  }

  const entity = await mongoDbDatabase.collection<ChatEntity>("chats").findOne({_id: id, userEmail: req.auth!["https://bcs-api/email"]!})

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


app.get('/api/chats', async (req, res) => {
  const userEmail = req.auth!["https://bcs-api/email"];
  const { search, sort, dir, skip, limit } = req.query;

  const chatsCollection = mongoDbDatabase.collection<ChatEntity>('chats');

  const searchStr = search?.toString();

  const getArchived = req.query.isArchived ? (
    req.query.isArchived === 'true'
  ) : false;

  const pipeline: any[] = [
    {
      $match: {
        userEmail,
        isArchived: getArchived
      }
    },
    // Convert _id -> string for lookup
    {
      $addFields: {
        _idStr: { $toString: "$_id" }
      }
    },
    // Join messages by chatId (string)
    {
      $lookup: {
        from: "messages",
        let: { chatIdStr: "$_idStr" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$chatId", "$$chatIdStr"] }
            }
          }
        ],
        as: "messages"
      }
    }
  ];

  // Only apply search if provided
  if (searchStr) {
    pipeline.push(
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { title: { $regex: searchStr, $options: "i" } },
            { "messages.text": { $regex: searchStr, $options: "i" } }
          ]
        }
      },
      {
        $group: {
          _id: "$_id",
          date: { $first: "$date" },
          title: { $first: "$title" },
          userEmail: { $first: "$userEmail" },
          isArchived: { $first: "$isArchived" },
          searchMessagesResult: {
            $push: {
              $cond: [
                { $regexMatch: { input: "$messages.text", regex: searchStr, options: "i" } },
                {
                  _id: { $toString: "$messages._id" },
                  text: "$messages.text",
                  date: "$messages.date",
                  isFromAi: "$messages.isFromAi"
                },
                "$$REMOVE"
              ]
            }
          }
        }
      }
    );
  }

  // Sorting and pagination
  const sortField = sort ? sort.toString() : 'date';
  const sortDir: 1 | -1 = dir && dir.toString() === 'asc' ? 1 : -1;
  pipeline.push({ $sort: { [sortField]: sortDir } });
  if (skip) pipeline.push({ $skip: +skip });
  if (limit) pipeline.push({ $limit: +limit });

  const entities = await chatsCollection.aggregate(pipeline).toArray();

  const chats: Chat[] = entities.map(e => ({
    _id: e._id.toString(),
    date: e.date,
    title: e.title,
    userEmail: e.userEmail,
    isArchived: e.isArchived,
    searchMessagesResult: e.searchMessagesResult || []
  }));

  res.send(chats);
});



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



app.delete('/api/delete/:chatId', async (req, res) => {

    const chatId = req.params.chatId;

    // Validate ObjectId
    if (!ObjectId.isValid(chatId)) {
     res.status(400).send({ message: 'Invalid chat ID' });
     return;
    }

    const userEmail = req.auth?.["https://bcs-api/email"];
   

    const chatsCollection = mongoDbDatabase.collection('chats');
    const messagesCollection = mongoDbDatabase.collection('messages');

    // Check if the chat exists and belongs to this user
    const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId), userEmail: userEmail });

    if (!chat) {
       res.status(404).send({ message: 'Chat not found or access denied' });
       return;
    }

    // Delete all messages in this chat
    const deleteMessagesResult = await messagesCollection.deleteMany({ chatId: chatId });

    // Delete the chat itself
    const deleteChatResult = await chatsCollection.deleteOne({ _id: new ObjectId(chatId) });

    res.status(200).send({
      message: 'Chat and associated messages deleted successfully',
      deletedChatCount: deleteChatResult.deletedCount,
      deletedMessageCount: deleteMessagesResult.deletedCount
    });


});


app.patch('/api/update/:chatId', async (req, res) => {
  
    const chatId = req.params.chatId;
    const { title, isArchived } = req.body;

    if (!ObjectId.isValid(chatId)) {
      return res.status(400).send({ message: 'Invalid chat ID' });
    }

    // Ensure exactly one field is provided
    if ((title !== undefined && isArchived !== undefined) || (title === undefined && isArchived === undefined)) {
      return res.status(400).send({ message: 'Provide exactly one of title or isArchived' });
    }

    if (isArchived !== undefined && typeof isArchived !== 'boolean') {
      return res.status(400).send({ message: 'isArchived must be a boolean' });
    }

    const userEmail = req.auth?.["https://bcs-api/email"];
    const updateChat = mongoDbDatabase.collection<ChatEntity>('chats');

    const chat = await updateChat.findOne({ _id: new ObjectId(chatId), userEmail });
    if (!chat) {
      return res.status(404).send({ message: 'Chat not found or access denied' });
    }

    const updateFields: UpdateChat = {};
    if (title !== undefined) updateFields.title = title;
    if (isArchived !== undefined) updateFields.isArchived = isArchived;

    const result = await updateChat.updateOne(
      { _id: new ObjectId(chatId) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 1) {
      res.send({ message: 'Chat updated successfully' });
    } else {
      res.status(400).send({ message: 'Failed to update chat' });
    }

  
});




app.use(notFoundHandler);

app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
