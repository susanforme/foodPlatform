// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import { addUser, getUserById, loginByData } from '@/controllers/user';
import { Context } from '@/document/context';

const userResolver = {
  Query: {
    user(_: any, args: any) {
      return getUserById(args.id);
    },
  },
  Mutation: {
    async register(_: any, args: any, context: Context) {
      const { password, username, email, phoneNumber, birthday } = args.data;
      const response = await addUser({
        ip: context.ip,
        password,
        username,
        email,
        phoneNumber,
        birthday,
      });
      // 输入session
      if (context.session) {
        context.session.username = username;
      }
      return response;
    },
    async login(_: any, args: any, context: Context) {
      // 在客户端,两个参数都必须传,不需要那个传递空字符串
      const { username, password, email } = args.data;
      const data = username ? { username, password } : { email, password };
      const response = await loginByData(data);
      // 输入session
      if (context.session) {
        context.session.username = response.username;
      }
      return response;
    },
  },
};

export default userResolver;
