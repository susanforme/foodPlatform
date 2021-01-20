/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 16:16:24
 * @FilePath: \foodPlatform\src\graphql\resolvers\test.ts
 * @LastEditTime: 2021-01-18 16:20:28
 */

const helloResolver = {
  Query: {
    hello() {
      let text = 1;
      const arr: number[] = [];
      for (let i = 0; i < 100000; i++) {
        text = text + Math.random() * 20;
        arr.push(text);
      }
      return 'result is ' + arr.sort().join(',');
    },
  },
};

export default helloResolver;
