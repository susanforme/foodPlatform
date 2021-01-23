// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import { getCaptcha } from '@/controllers/tool';

export default {
  Query: {
    async captcha() {
      const response = getCaptcha();
      return response;
    },
  },
};
