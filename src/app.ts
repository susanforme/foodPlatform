/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 15:52:26
 * @FilePath: \foodPlatform\src\app.ts
 * @LastEditTime: 2021-01-18 18:30:33
 */
import 'module-alias/register';
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './config/typeDefs';
import { resolvers } from './config/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`服务已经在${url} 启动`);
});
