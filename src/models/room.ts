import mongoose from 'mongoose';
import { IUser } from './user';

// 聊天室schema
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  createTime: {
    type: Number,
    required: true,
  },
  record: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Record',
    },
  ],
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  // 最后活跃时间
  lastActiveTime: {
    type: Number,
    required: true,
  },
});
const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;

interface IRoom extends mongoose.Document {
  roomId: string;
  createTime: number;
  record: any[];
  // 在聊天室的两个人
  user: IUser[] | string[];
  lastActiveTime: number;
}
