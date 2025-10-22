export interface Message {
  _id?: string,
  chatId: string,
  date?: number,
  isFromAi?: boolean,
  text: string

}