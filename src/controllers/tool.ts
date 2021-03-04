// 工具接口的所有控制器
import svgCaptcha from 'svg-captcha';
import BASE64 from 'base64-js';
import { getRandomNums, PATH_ENV } from '@/plugins';
import fetch from 'node-fetch';

export async function getCaptcha() {
  const colors = getRandomNums(3, true, 0, 255);
  const captcha = svgCaptcha.create({
    background: `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${
      0.1 * Math.random()
    })`,
  });
  const svgBase64 = BASE64.fromByteArray(Buffer.from(captcha.data));
  return {
    text: captcha.text,
    img: 'data:image/svg+xml;base64,' + svgBase64,
  };
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
 * 获取天气
 */
export async function getWeather(adcode: string) {
  const weather = await fetch(`
  https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${PATH_ENV.MY_GD_SERVER_KEY}
  `).then((response) => response.json());
  return weather?.lives[0];
}

/**
 * @description
 * 通过坐标获取静态图片
 */
export async function getImgByCoord(location: string) {
  const data = await fetch(
    `https://restapi.amap.com/v3/staticmap?location=${location}&zoom=10&size=750*300&markers=large,,A:116.481485,39.990464&key=${PATH_ENV.MY_GD_SERVER_KEY}&scale=2`,
  ).then((res) => res.buffer());
  return 'data:image/png;base64,' + BASE64.fromByteArray(data);
}
