import 'module-alias/register';
import { typeDefs } from './document/typeDefs';
import { resolvers } from './document/resolvers';
import { readFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import https from 'https';
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { FoodServer, NODE_ENV } from '@/plugins/types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { mySession, now, PATH_ENV } from './plugins';
import { context } from './document/context';
import { configurations } from './config';
import { graphqlUploadExpress } from 'graphql-upload';
import socket from 'socket.io';
import setWs from './plugins/ws';

const cert = readFileSync(join(__dirname, '../cert/cert.pem'));
const key = readFileSync(join(__dirname, '../cert/key.pem'));
const options = { key, cert };
const config = configurations[(process.env.NODE_ENV as NODE_ENV) || 'production'];
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  // 缓存
  plugins: [responseCachePlugin()],
  uploads: false,
  context,
  // 生产false关闭
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
});
const app = express();

app.use(mySession);
app.use(
  graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 10,
  }),
);
apollo.applyMiddleware({ app });

let server: FoodServer;

if (config.ssl) {
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

const socketServer = socket(server, { wsEngine: 'ws' });

mongoose
  .connect('mongodb://localhost:27017/food', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
    pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
  })
  .then(() => {
    console.log(`${now()},数据库连接成功`);
    setWs(socketServer);
    server.listen(config.port, '127.0.0.1', () => {
      console.log(`${now()},websocket服务启动成功`);
      console.log(
        `${now()},服务器成功启动在http${config.ssl ? 's' : ''}://${config.hostname}:${
          config.port
        }/graphql`,
      );
    });
  })
  .catch((err) => {
    console.log(err?.message);
  });
