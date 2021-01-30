import { join } from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { IComment } from '@/models/comment';
import session from 'express-session';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';
import { PubSub } from 'apollo-server';

export function getIsDev() {
  return process.env.NODE_ENV === 'development';
}

export const PATH_ENV = dotenv.config({ path: join(process.cwd(), '/bin/.env') }).parsed || {};

export const now = () => dayjs().format('YYYY-MM-DD H时mm分s秒');

export const ROOT_DIR = join(__dirname, '../../');

export const pubSub = new PubSub();

export async function ipToAddress(ip: string): Promise<string> {
  // 开发模式直接返回北京
  if (!ip || getIsDev()) {
    return '北京';
  }
  const data = await fetch(
    `https://api.map.baidu.com/location/ip?ak=${PATH_ENV.MY_BAIDU_SERVER_KEY}&ip=${ip}&coor=bd09ll`,
  ).then((response) => response.json());
  console.log(`${now()} 当前注册账户访问ip为` + ip);
  return data?.content?.address;
}

/**
 * @description
 * 随机数生成
 * @param count 生成随机数数量
 * @param isInteger 是否为整数
 * @param low 下边界
 * @param high 上边界
 */
export function getRandomNums(count: number, isInteger: boolean, low: number, high: number) {
  const randomNums: number[] = [];
  for (let i = 0; i < count; i++) {
    const num = Math.random() * (high - low) + low;
    if (isInteger) {
      randomNums.push(Math.round(num));
    } else {
      randomNums.push(num);
    }
  }
  return randomNums;
}

export function getCommentTree(comment: IComment[]) {
  const father = comment.filter((v) => v.commentFatherId === undefined),
    child = comment.filter((v) => v.commentFatherId !== undefined);
  child.forEach((v) => {
    const childFather = v.commentFatherId;
    for (const key in father) {
      if (childFather === father[key].id) {
        father[key].commentChild = v;
        return;
      }
    }
  });
  return father;
}

export function createSession() {
  const MongoStore = mongo(session);
  const connection = mongoose.createConnection('mongodb://localhost:27017/food', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: PATH_ENV.DATA_BASE_FOOD_ACCOUNT,
    pass: PATH_ENV.DATA_BASE_FOOD_PASSWORD,
  });

  return session({
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
  });
}
