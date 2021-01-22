import session from 'express-session';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';
import express from 'express';
import { PATH_ENV } from '@/plugins';
import bodyPareser from 'body-parser';

const MongoStore = mongo(session);

const connection = mongoose.createConnection('mongodb://localhost:27017/food', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
  pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
});

export const setConfig = function (app: express.Express) {
  app.use(bodyPareser.json());
  app.use(
    session({
      secret: 'food platform',
      resave: false,
      // 保存在本地cookie的一个名字 默认connect.sid  可以不设置
      name: 'connect.sid',
      // 过期时间
      cookie: { maxAge: 2592000000, sameSite: 'lax', secure: false },
      // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
      rolling: true,
      store: new MongoStore({
        mongooseConnection: connection,
        // 通过这样做，设置touchAfter:24 * 3600，您在24小时内只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
        touchAfter: 24 * 3600,
      }),
      saveUninitialized: true,
    }),
  );
};

export const configurations = {
  production: { ssl: true, port: 443, hostname: 'localhost' },
  development: { ssl: false, port: 4000, hostname: 'localhost' },
};
