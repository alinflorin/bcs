import { Message } from "./message";

export interface Chat {
    _id?: string,
    date: number,
    title: string,
    userEmail: string,
    isArchived: boolean,
    searchMessagesResult?: Message[]
}