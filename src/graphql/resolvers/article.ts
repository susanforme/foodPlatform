import {
  createArticle,
  createArticleComment,
  deleteArticle,
  getArticle,
  getArticleUserGive,
  updateArticle,
  updateArticleGive,
  updateArticleTraffic,
} from '@/controllers/article';
import { createComment } from '@/controllers/comment';
import { Context } from '@/document/context';
import { errMap, ServerError } from '@/plugins/errors';

export default {
  Query: {
    async article(_: any, args: any, context: Context) {
      const id = args.id;
      const userId = context.session.userId || '';
      const datas = await Promise.all([getArticle(id), getArticleUserGive(id, userId)]);
      return {
        ...datas[0],
        ...datas[1],
      };
    },
  },
  Mutation: {
    async createArticle(_: any, args: any, context: Context) {
      if (!context.session.userId) {
        throw new ServerError(errMap.user.U0008);
      }
      const data = args.data;
      const response = await createArticle(data);
      return {
        articleId: response.id,
      };
    },
    async updateArticle(_: any, args: any, context: Context) {
      if (!context.session.userId) {
        throw new ServerError(errMap.user.U0008);
      }
      const data = args.data;
      const response = await updateArticle(data);
      return {
        articleId: response.id,
      };
    },
    async deleteArticle(_: any, args: any, context: Context) {
      if (!context.session.userId) {
        throw new ServerError(errMap.user.U0008);
      }
      const id = args.id;
      const response = await deleteArticle(id);
      return response;
    },
    // 发表评论
    async createArticleComment(_: any, args: any, context: Context) {
      const { articleId, comment, commentFatherId, img } = args.data;
      const response = await createComment({
        comment,
        articleId,
        commentFatherId,
        img,
        publisher: context.session.userId,
      });
      await createArticleComment({ articleId, commentId: response.id });
      return response;
    },
    // 访问量
    async updateArticleTraffic(_: any, args: any) {
      const id = args.id;
      const traffic = await updateArticleTraffic(id);
      return traffic;
    },
    // 点赞文章
    async updateArticleGive(_: any, args: any, context: Context) {
      const articleId = args.id;
      const giveCount = await updateArticleGive(articleId, context.session.userId);
      return giveCount;
    },
  },
};
