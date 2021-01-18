/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 16:26:32
 * @FilePath: \foodPlatform\src\plugins\index.ts
 * @LastEditTime: 2021-01-18 16:28:23
 */

export function getIsDev() {
  return process.env.NODE_ENV === 'development';
}
