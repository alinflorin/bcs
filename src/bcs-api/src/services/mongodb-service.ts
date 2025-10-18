import { MongoClient } from "mongodb";

const url = `mongodb://${
  process.env.MONGODB_USERNAME
    ? process.env.MONGODB_USERNAME + `:` + process.env.MONGODB_PASSWORD + "@"
    : ``
}${process.env.MONGODB_HOSTNAME || "localhost"}:${process.env.MONGODB_PORT || 27017}/${process.env.MONGODB_DATABASE || "bcs"}`;
const client = new MongoClient(url);
const mongoDbDatabase = client.db(`${process.env.MONGODB_DATABASE || "bcs"}`);
export default mongoDbDatabase;