// 工具接口的所有控制器
import svgCaptcha from 'svg-captcha';
import BASE64 from 'base64-js';
import { getRandomNums } from '@/plugins';

export async function getCaptcha() {
  const colors = getRandomNums(3, true, 0, 255);
  const captcha = svgCaptcha.create({
    background: `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${0.1 * Math.random()})`,
  });
  const svgBase64 = BASE64.fromByteArray(Buffer.from(captcha.data));
  return {
    text: captcha.text,
    img: 'data:image/svg+xml;base64,' + svgBase64,
  };
}
