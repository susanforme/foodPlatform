import mongoose from 'mongoose';
import { IUser } from './user';

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  createTime: {
    type: Number,
    required: true,
  },
  // 发表评论的人
  publisher: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: {
    type: String,
    required: true,
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  // 可以被编辑,最后编辑时间,没有则不提示
  lastEditTime: {
    type: Number,
  },
  // 有哪些人点赞了
  give: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  // 父评论id,可能没有,根据是否有父评论来返回数据,当楼主删除时,所有楼下的都被删除
  commentFatherId: {
    type: Schema.Types.ObjectId,
  },
  // 保留字段,评论带图
  img: {
    type: String,
  },
});
const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;

export interface IComment extends mongoose.Document {
  createTime: number;
  publisher: IUser | string;
  comment: string;
  articleId: string;
  lastEditTime?: number;
  commentFatherId?: string;
  // 数据库中并不存在,目的是为了添加到返回数据中
  commentChild?: [IComment];
  img?: string;
}
