import { ObjectId } from "mongodb";

export interface ChatEntity {
    _id?: ObjectId,
    date: number,
    title: string,
    userEmail: string,
    isArchived: boolean
}