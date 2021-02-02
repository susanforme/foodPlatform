import { deleteRoom, getPersonalChatList, queryPersonalHistoryChat } from '@/controllers/chat';
import { Context } from '@/document/context';
import { getRoomId } from '@/plugins';
import { errMap, ServerError } from '@/plugins/errors';

export default {
  Query: {
    async messageList(_: any, args: any, context: Context) {
      const id = args.id;
      if (context.session.userId !== id) {
        throw new ServerError(errMap.chat.C0001);
      }
      const data = await getPersonalChatList(id);
      return data;
    },
    async chatHistory(_: any, args: any, context: Context) {
      const { me, other, page } = args;
      if (context.session.userId !== me) {
        throw new ServerError(errMap.chat.C0001);
      }
      const data = await queryPersonalHistoryChat(getRoomId([me, other]), page);
      return data;
    },
  },
  Mutation: {
    async deleteRoom(_: any, args: any, context: Context) {
      const id = args.id;
      if (context.session.userId !== id) {
        throw new ServerError(errMap.chat.C0001);
      }
      await deleteRoom(id);
      return {
        code: '00000',
        msg: 'success',
      };
    },
  },
};
