import mongoose from 'mongoose';
import { IComment } from './comment';
import { IKind } from './kind';
import { IUser } from './user';

const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
  createTime: {
    type: Number,
    required: true,
  },
  author: {
    required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  // 标题限制字数
  title: {
    type: String,
    required: true,
  },
  // 只能出现文字
  content: {
    type: String,
    required: true,
  },
  // 访问量
  traffic: {
    type: Number,
    default: 0,
  },
  // 有哪些人点赞了
  give: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  // 不返回所有评论
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  // 可以被编辑,最后编辑时间,没有则不提示
  lastEditTime: {
    type: Number,
  },
  // 显示在底部,最多4个,最少两个
  label: [
    {
      type: String,
      required: true,
    },
  ],
  kind: {
    type: Schema.Types.ObjectId,
    ref: 'kind',
  },
  // 做成轮播图,在顶部
  imgPath: {
    type: Array,
    required: true,
  },
  // location地理位置
  location: {
    type: String,
    required: true,
  },
  // 评分
  score: {
    type: Number,
    required: true,
  },
});
const Article = mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;

export interface IArticle extends mongoose.Document {
  createTime: number;
  author: IUser | string;
  title: string;
  content: string;
  traffic: number;
  give: IUser[] | string[];
  comment: IComment[] | string[];
  lastEditTime: number;
  // 显示在文章下半区的小标签
  label: string[];
  // 大的分类
  kind: IKind | string;
  imgPath: string[];
  location: string;
  score: number;
}
