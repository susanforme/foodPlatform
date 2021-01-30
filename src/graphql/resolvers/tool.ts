// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import { getCaptcha } from '@/controllers/tool';
import { now } from '@/plugins';
import cosUpload from '@/plugins/cosUpload';

export default {
  Query: {
    async captcha() {
      const response = getCaptcha();
      return response;
    },
  },
  Mutation: {
    async singleUpload(_: any, args: any) {
      const { createReadStream, filename } = await args.file;
      const stream = createReadStream();
      const { url } = await cosUpload({
        filename,
        file: stream,
      });
      console.log(`${now()},文件名为${filename}上传成功`);
      return {
        url,
      };
    },
  },
};
