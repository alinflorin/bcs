import { Message } from "./message";

export interface Chat {
    _id?: string,
    date: number,
    title: string,
    userEmail: string,
    isArchived: boolean,
    searchMessagesResult?: Message[]
    isPublic?: boolean;     
    publicId?: string; 
}