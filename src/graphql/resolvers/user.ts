// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import { addUser } from '@/controllers/user';
import { Context } from '@/document/context';

const userResolver = {
  Query: {
    user(_: any, args: any) {},
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
  },
};

export default userResolver;
