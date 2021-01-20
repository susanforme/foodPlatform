import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createTime: {
    type: Number,
    required: true,
  },
  headImg: {
    type: String,
    required: true,
  },
  // 登录可以采用邮箱或者用户名
  email: {
    type: String,
  },
  // 根据ip自动获取,若地址不同,则提示上次登录位置
  location: {
    type: String,
    required: true,
  },
  // new Date().valueOf()
  birthday: {
    type: Number,
  },
  // 以下皆为预留字段
  phonenumber: {
    type: String,
  },
});
const User = mongoose.model<IUser>('User', UserSchema);

export default User;

export interface IUser extends mongoose.Document {
  createTime: number;
  username: string;
  password: string;
  headImg: string;
  location: String;
  birthday?: number;
  email?: string;
}
