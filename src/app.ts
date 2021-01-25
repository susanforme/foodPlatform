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
import { now, PATH_ENV } from './plugins';
import { context } from './document/context';
import { setConfig, configurations } from './config';

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
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
});
const app = express();

setConfig(app);

app.use('/graphql', (req, res, next) => {
  console.log(req.session?.username);
  next();
});
apollo.applyMiddleware({ app });

let server: FoodServer;

if (config.ssl) {
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

console.log(`${now()},开始数据库连接`);
mongoose
  .connect('mongodb://localhost:27017/food', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
    pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
  })
  .then(() => {
    console.log(`${now()},数据库连接成功`);
    server.listen(config.port, () => {
      console.log(
        `${now()},服务器成功启动在http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}`,
      );
    });
  });
