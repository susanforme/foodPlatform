import 'module-alias/register';
import { typeDefs } from './config/typeDefs';
import { resolvers } from './config/resolvers';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import https from 'https';
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import configurations from '../bin/config';
import { FoodServer, NODE_ENV } from '@/types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

const cert = readFileSync(join(__dirname, '../cert/cert.pem'));
const key = readFileSync(join(__dirname, '../cert/key.pem'));
const PATH_ENV = dotenv.config({ path: join(process.cwd(), '/bin/.env') }).parsed || {};
const options = { key, cert };
const config = configurations[process.env.NODE_ENV as NODE_ENV];
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  // 缓存
  plugins: [responseCachePlugin()],
});
const app = express();
apollo.applyMiddleware({ app });
let server: FoodServer;

if (config.ssl) {
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

mongoose
  .connect('mongodb://localhost:27017/food', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
    pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
  })
  .then(() => {
    server.listen(config.port, () => {
      console.log(
        `服务器已经成功启动在http${config.ssl ? 's' : ''}://${config.hostname}:${
          config.port
        }/graphql`,
      );
    });
  });
