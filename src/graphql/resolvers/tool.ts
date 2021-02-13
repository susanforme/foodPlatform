// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import { getCaptcha } from '@/controllers/tool';
import { now, PATH_ENV } from '@/plugins';
import cosUpload from '@/plugins/cosUpload';
import fetch from 'node-fetch';

export default {
  Query: {
    async captcha() {
      const response = getCaptcha();
      return response;
    },
    async wallPaper(_: any, args: any) {
      const search = encodeURI(args.search);
      const { total } = await fetch(
        `https://image.so.com/j?q=${search}&src=srp&sn=1&pn=1&zoom=1`,
      ).then((res) => res.json());
      const randomNum = Math.round(Math.random() * total);
      const data = await fetch(
        `https://image.so.com/j?q=${search}&src=srp&sn=${randomNum - 1}&pn=1&zoom=1`,
      ).then((res) => res.json());
      return data.list[0].img;
    },
    async coord(_: any, args: any) {
      const search = encodeURI(args.search);
      const data = await fetch(`
      https://restapi.amap.com/v3/config/district?keywords=${search}&subdistrict=0&key=${PATH_ENV.MY_GD_SERVER_KEY}`).then(
        (res) => res.json(),
      );
      return data.districts[0];
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
