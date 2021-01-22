import { join } from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

export function getIsDev() {
  return process.env.NODE_ENV === 'development';
}

export const PATH_ENV = dotenv.config({ path: join(process.cwd(), '/bin/.env') }).parsed || {};

export async function ipToAddress(ip: string): Promise<string> {
  // 开发模式直接返回北京
  if (!ip || getIsDev()) {
    return '北京';
  }
  const data = await fetch(
    `https://api.map.baidu.com/location/ip?ak=${PATH_ENV.MY_BAIDU_SERVER_KEY}&ip=${ip}&coor=bd09ll`,
  ).then((response) => response.json());
  console.log(`当前注册账户访问ip为` + ip);
  return data?.content?.address;
}
