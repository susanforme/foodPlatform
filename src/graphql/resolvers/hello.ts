/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 16:16:24
 * @FilePath: \foodPlatform\src\graphql\resolvers\test.ts
 * @LastEditTime: 2021-01-18 16:20:28
 */

const helloResolver = {
  Query: {
    hello() {
      return 'hello wrold';
    },
  },
};

export default helloResolver;
