// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import {
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  loginByData,
  updateUserLocation,
} from '@/controllers/user';
import { Context } from '@/document/context';
import { ipToAddress, now } from '@/plugins';
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
      const weatherData = await ipToAddress(context.ip);
      const { weather, temperature, adcode, city } = weatherData;
      const response = await createUser({
        password,
        username,
        email,
        phoneNumber,
        birthday,
        location: city,
      });
      // 输入session
      if (context.session) {
        context.session.username = username;
        context.session.userId = response.id;
      }
      return {
        ...response,
        weather: {
          temperature,
          weather,
          adcode,
        },
      };
    },
    // 登录
    async login(_: any, args: any, context: Context) {
      // 在客户端,两个参数都必须传,不需要那个传递空字符串
      const { username, password, email } = args.data;
      const data = username ? { username, password } : { email, password };
      const response = await Promise.all([loginByData(data), ipToAddress(context.ip)]);
      const { weather, temperature, city, adcode } = response[1];
      await updateUserLocation(context.session.userId, response[1].city);
      // 输入session
      if (context.session) {
        context.session.username = response[0].username;
        context.session.userId = response[0].id;
      }
      console.log(`${now()},username为${username}登录成功`);
      return {
        ...response[0],
        location: city,
        weather: {
          temperature,
          weather,
          adcode,
        },
      };
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
      console.log(`${now()},username为${username}登录成功`);
      const response = await Promise.all([getUserByUsername(username), ipToAddress(context.ip)]);
      const { weather, temperature, city, adcode } = response[1];
      await updateUserLocation(context.session.userId, response[1].city);
      return {
        ...response[0],
        location: city,
        weather: {
          temperature,
          weather,
          adcode,
        },
      };
    },
  },
};
