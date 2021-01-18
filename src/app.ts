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
