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
import configurations from '../bin/config';
import { FoodServer, NODE_ENV } from '@/types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { PATH_ENV } from './plugins';
import bodyPareser from 'body-parser';
import { getMySession } from './config';
import { context } from './document/context';

const cert = readFileSync(join(__dirname, '../cert/cert.pem'));
const key = readFileSync(join(__dirname, '../cert/key.pem'));
const options = { key, cert };
const config = configurations[process.env.NODE_ENV as NODE_ENV];
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  // 缓存
  plugins: [responseCachePlugin()],
  context,
});
const app = express();
apollo.applyMiddleware({ app });
let server: FoodServer;

if (config.ssl) {
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

const connection = mongoose.createConnection('mongodb://localhost:27017/food', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
  pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
});

connection.then(() => {
  app.use(bodyPareser.json());
  app.use(getMySession(connection));

  server.listen(config.port, () => {
    console.log(
      `服务器已经成功启动在http${config.ssl ? 's' : ''}://${config.hostname}:${
        config.port
      }/graphql`,
    );
  });
});
