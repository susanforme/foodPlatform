import { join } from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

export function getIsDev() {
  return process.env.NODE_ENV === 'development';
}

export const PATH_ENV = dotenv.config({ path: join(process.cwd(), '/bin/.env') }).parsed || {};

export async function ipToAddress(ip: string) {
  const data = await fetch(
    `https://api.map.baidu.com/location/ip?ak=${PATH_ENV.MY_BAIDU_SERVER_KEY}&ip=${ip}&coor=bd09ll`,
  ).then((response) => response.json());
  return data.content.address;
}
