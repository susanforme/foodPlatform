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
import { FoodServer, NODE_ENV } from '@/plugins/types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { PATH_ENV } from './plugins';
import { context } from './document/context';
import { setConfig } from './config';
import dayjs from 'dayjs';

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

setConfig(app);
apollo.applyMiddleware({ app, path: '/' });
let server: FoodServer;

if (config.ssl) {
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

console.log(`${dayjs().format('YYYY-MM-DD H时mm分s秒')},开始数据库连接`);
mongoose
  .connect('mongodb://localhost:27017/food', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
    pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
  })
  .then(() => {
    console.log(`${dayjs().format('YYYY-MM-DD H时mm分s秒')},数据库连接成功`);
    server.listen(config.port, () => {
      console.log(
        `${dayjs().format('YYYY-MM-DD H时mm分s秒')},服务器成功启动在http${
          config.ssl ? 's' : ''
        }://${config.hostname}:${config.port}`,
      );
    });
  });
