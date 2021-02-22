import { createEmoji } from '@/controllers/emoji';
import { createKind } from '@/controllers/kind';

export default {
  Mutation: {
    async createKind(_: any, args: any) {
      const kindName = args.kindName;
      const data = await createKind(kindName);
      return data;
    },
    async createEmoji(_: any, args: any) {
      const emoji = args.emoji;
      const promises = [];
      for (let i = 0; i < emoji.length; i++) {
        promises.push(createEmoji(emoji[i]));
      }
      const data = await Promise.all(promises);
      return data;
    },
  },
};
