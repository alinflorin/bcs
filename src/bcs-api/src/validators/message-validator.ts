
import { object, string, boolean, number } from 'yup';
import { Message } from '../models/message';
import { ObjectId } from 'mongodb';

const messageValidator = object<Message>({
  _id: string().optional(),
  chatId: string().required().test(
      'is-objectid', // test name
      'chatId must be a valid ObjectId', // error message
      (value) => value ? ObjectId.isValid(value) : false // validation function
    ),
  date: number().optional(),
  isFromAi: boolean().optional(),
  text: string().required()
})

export default messageValidator