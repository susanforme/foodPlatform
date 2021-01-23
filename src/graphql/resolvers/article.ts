import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticleUserGive,
  updateArticle,
} from '@/controllers/article';
import { Context } from '@/document/context';
import { errMap, ServerError } from '@/plugins/errors';

export default {
  Query: {
    async article(_: any, args: any, context: Context) {
      const id = args.id;
      const userId = context.session.id || '';
      const datas = await Promise.all([getArticle(id), getArticleUserGive(id, userId)]);
      return {
        ...datas[0],
        ...datas[1],
      };
    },
  },
  Mutation: {
    async createArticle(_: any, args: any, context: Context) {
      if (!context.session.id) {
        throw new ServerError(errMap.user.U0008);
      }
      const data = args.data;
      const response = await createArticle(data);
      return {
        code: '00000',
        msg: '创建文章成功',
        id: response.id,
      };
    },
    async updateArticle(_: any, args: any, context: Context) {
      if (!context.session.id) {
        throw new ServerError(errMap.user.U0008);
      }
      const data = args.data;
      const response = await updateArticle(data);
      return {
        code: '00000',
        msg: '创建文章成功',
        id: response.id,
      };
    },
    async deleteArticle(_: any, args: any, context: Context) {
      if (!context.session.id) {
        throw new ServerError(errMap.user.U0008);
      }
      const id = args.id;
      const response = await deleteArticle(id);
      return response;
    },
  },
};
