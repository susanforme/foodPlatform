import { join } from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { IComment } from '@/models/comment';
import session from 'express-session';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';

export function getIsDev() {
  return process.env.NODE_ENV === 'development';
}

export const PATH_ENV = dotenv.config({ path: join(process.cwd(), '/bin/.env') }).parsed || {};

export const now = () => dayjs().format('YYYY-MM-DD H时mm分s秒');

export const ROOT_DIR = join(__dirname, '../../');

export function getRoomId(ids: string[]): string {
  return ids.sort().reduce((pre, cur) => pre + cur);
}

/**
 * @description
 * 将ip转换为地址
 */
export async function ipToAddress(ip: string) {
  // 开发模式直接返回北京
  let newIp = ip;
  if (!ip || getIsDev()) {
    newIp = '223.86.198.28';
  }
  const address = await fetch(
    `https://restapi.amap.com/v3/ip?ip=${newIp}&key=${PATH_ENV.MY_GD_SERVER_KEY}`,
  ).then((response) => response.json());

  console.log(`${now()} 当前账户访问ip为` + newIp);
  return {
    adcode: address.adcode,
    city: address.city,
  };
}

/**
 *
 */
export async function getWeather(adcode: string) {
  const weather = await fetch(`
  https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${PATH_ENV.MY_GD_SERVER_KEY}
  `).then((response) => response.json());
  return weather?.lives[0];
}

/**
 * @description
 * 获取坐标
 */
export async function getCoord(search: string) {
  const data = await fetch(`
      https://restapi.amap.com/v3/place/text?key=${PATH_ENV.MY_GD_SERVER_KEY}&keywords=${search}&types=&city=&children=1&offset=1&page=1&extensions=all`).then(
    (res) => res.json(),
  );
  return data?.pois[0];
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

export const mySession = (function createSession() {
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
})();
