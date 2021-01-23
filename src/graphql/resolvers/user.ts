// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import {
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  loginByData,
} from '@/controllers/user';
import { Context } from '@/document/context';
import { auth, now } from '@/plugins';
import { errMap, ServerError } from '@/plugins/errors';

export default {
  Query: {
    async user(_: any, args: any) {
      const response = await getUserById(args.id);
      return response;
    },
  },
  Mutation: {
    // 注册账号
    async register(_: any, args: any, context: Context) {
      // 防止传入错误参数
      const { password, username, email, phoneNumber, birthday } = args.data;
      const response = await createUser({
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
    // 登录
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
    // 删除账号
    async remove(_: any, args: any, context: Context) {
      const id = args.id,
        username = context.session.username;
      const authResult = await auth(id, username);
      if (!authResult) {
        throw new ServerError(errMap.user.U0007);
      }
      const response = await deleteUser(id);
      context.session?.destroy(() => {
        console.log(`${now()} id为${id},username为${username}的账户已经注销成功,并成功清除session`);
      });
      return response;
    },
    // 通过session登录
    async loginBySession(_: any, __: any, context: Context) {
      const username = context.session.username;
      if (!username) {
        return errMap.user.U0008;
      }
      const response = await getUserByUsername(username);
      return response;
    },
  },
};
