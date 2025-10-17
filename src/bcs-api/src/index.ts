import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { version } from "./version";
import { MongoClient } from "mongodb";
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const url = `mongodb://${
  process.env.MONGODB_USERNAME
    ? process.env.MONGODB_USERNAME + `:` + process.env.MONGODB_PASSWORD
    : ``
}${process.env.MONGODB_HOSTNAME}:27017/bcs`;
const client = new MongoClient(url);
const baza = client.db("bcs");

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", version: version });
});

app.use(
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://dev-kpiuw0wghy7ta8x8.us.auth0.com/.well-known/jwks.json`,
    }),
    audience: "https://bcs-api/",
    issuer: `https://dev-kpiuw0wghy7ta8x8.us.auth0.com/`,
    algorithms: ["RS256"],
  })
);

app.post("/api/chat/new", async (req, res) => {
  const email = (req as any).auth["https://bcs-api/email"];
  const chat = {
    isArchived: false,
    date: new Date().getTime(),
    title: "New Chat",
    userEmail: email,
  };

  await baza.collection("chats").insertOne(chat);
  res.send(chat);
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
