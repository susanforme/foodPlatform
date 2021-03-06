// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import { getFoodTagsByUserId, getSortArticle } from '@/controllers/article';
import { getCommentByUserId } from '@/controllers/comment';
import { getDiscussByUserId } from '@/controllers/record';
import {
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  loginByData,
  updateHeadImg,
  updateUserLocation,
} from '@/controllers/user';
import { Context } from '@/document/context';
import { ipToAddress, now } from '@/plugins';
import { errMap, ServerError } from '@/plugins/errors';

export default {
  Query: {
    async user(_: any, args: any) {
      const id = args.id;
      const response = await Promise.all([
        getUserById(id),
        getDiscussByUserId(id),
        getFoodTagsByUserId(id),
        getSortArticle({ userId: id }),
        getCommentByUserId(id),
      ]);
      return {
        user: response[0],
        discuss: response[1],
        foodTags: response[2],
        article: response[3],
        articleCount: response[3].total,
        comment: response[4],
        commentCount: response[4].length,
      };
    },
  },
  Mutation: {
    // 注册账号
    async register(_: any, args: any, context: Context) {
      // 防止传入错误参数
      const { password, username, email, phoneNumber, birthday } = args.data;
      const weatherData = await ipToAddress(context.ip);
      const { adcode } = weatherData;
      const response = await createUser({
        password,
        username,
        email,
        phoneNumber,
        birthday,
        location: adcode,
      });
      // 输入session
      if (context.session) {
        context.session.username = username;
        context.session.userId = response.id;
      }
      return response;
    },
    // 登录
    async login(_: any, args: any, context: Context) {
      // 在客户端,两个参数都必须传,不需要那个传递空字符串
      const { username, password, email } = args.data;
      const data = username ? { username, password } : { email, password };
      const response = await Promise.all([
        loginByData(data),
        ipToAddress(context.ip),
      ]);
      const { adcode } = response[1];
      updateUserLocation(context.session.userId, response[1].city);
      // 输入session
      if (context.session) {
        context.session.username = response[0].username;
        context.session.userId = response[0].id;
      }
      console.log(`${now()},username为${username}登录成功`);
      return Object.assign(response[0], {
        location: adcode,
      });
    },
    // 删除账号
    async remove(_: any, args: any, context: Context) {
      const id = args.id,
        username = context.session.username;
      if (id !== context.session.userId) {
        throw new ServerError(errMap.user.U0007);
      }
      const response = await deleteUser(id);
      context.session?.destroy(() => {
        console.log(
          `${now()} id为${id},username为${username}的账户已经注销成功,并成功清除session`,
        );
      });
      return response;
    },
    // 通过session登录
    async loginBySession(_: any, __: any, context: Context) {
      const username = context.session.username;
      if (!username) {
        return errMap.user.U0008;
      }
      console.log(`${now()},username为${username}登录成功`);
      const response = await Promise.all([
        getUserByUsername(username),
        ipToAddress(context.ip),
      ]);
      const { adcode } = response[1];
      updateUserLocation(context.session.userId, response[1].city);
      return Object.assign(response[0], {
        location: adcode,
      });
    },
    async logout(_: any, __: any, context: Context) {
      const data = await new Promise((resolve, reject) => {
        context.session.destroy((err: any) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
      return data;
    },
    async updateHeadImg(_: any, args: any, context: Context) {
      const url = args.url;
      const userId = context.session.userId;
      if (!userId) {
        throw new Error('未登录');
      }
      await updateHeadImg(url, userId);
      return true;
    },
  },
};
