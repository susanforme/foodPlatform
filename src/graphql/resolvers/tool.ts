// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

import { getEmoji } from '@/controllers/emoji';
import { getCaptcha, getCoord, getImgByCoord, getWeather } from '@/controllers/tool';
import { now } from '@/plugins';
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
      const data = await getCoord(search);
      return {
        ...data,
        cityCode: data?.citycode,
      };
    },
    async weather(_: any, args: any) {
      const data = await getWeather(args.city);
      return data;
    },
    async imgByCoord(_: any, args: any) {
      const url = await getImgByCoord(args.location);
      return url;
    },
    async emoji(_: any, args: any) {
      const { page, perPage } = args;
      const emoji = await getEmoji(page, perPage);
      return emoji;
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
