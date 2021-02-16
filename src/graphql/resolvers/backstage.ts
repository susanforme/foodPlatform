import { createKind } from '@/controllers/kind';

export default {
  Mutation: {
    async createKind(_: any, args: any) {
      const kindName = args.kindName;
      const data = await createKind(kindName);
      return data;
    },
  },
};
