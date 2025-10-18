import { ObjectId } from "mongodb";

export interface MessagesEntity {
  _id?: ObjectId,
  chatId: string,
  date: number,
  isFromAi: boolean,
  text: string

}