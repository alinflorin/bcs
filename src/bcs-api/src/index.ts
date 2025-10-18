import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { version } from "./version";
import { MongoClient } from "mongodb";
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

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
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.OIDC_JWKS_URI || `https://dev-kpiuw0wghy7ta8x8.us.auth0.com/.well-known/jwks.json`,
    }),
    audience: process.env.OIDC_AUDIENCE || "https://bcs-api/",
    issuer: process.env.OIDC_ISSUER || `https://dev-kpiuw0wghy7ta8x8.us.auth0.com/`,
    algorithms: ["RS256"],
  })
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

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
