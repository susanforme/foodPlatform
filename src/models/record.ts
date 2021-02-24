import mongoose from 'mongoose';
import { IUser } from './user';

const Schema = mongoose.Schema;
const RecordSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  createTime: {
    type: Number,
    required: true,
  },
  send: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receive: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    default: ' ',
  },
  // 保留字段img
  img: {
    type: String,
  },
});
const Record = mongoose.model<IRecord>('Record', RecordSchema);

export default Record;

interface IRecord extends mongoose.Document {
  send: IUser | string;
  receive: IUser | string;
  message: string;
  createTime: number;
  roomId: string;
  img?: string;
}
