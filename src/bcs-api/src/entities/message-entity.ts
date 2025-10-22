import { ObjectId } from "mongodb";

export interface MessageEntity {
  _id?: ObjectId,
  chatId: string,
  date: number,
  isFromAi: boolean,
  text: string

}