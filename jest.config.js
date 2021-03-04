/*
 * @Author: Spring Breeze
 * @Date: 2021-01-18 19:42:07
 * @FilePath: \foodPlatform\jest.config.js
 * @LastEditTime: 2021-01-18 19:42:08
 */
module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^variables$': 'variables/dist/cjs',
    '^[NAME OF MODULE YOU WANT TO IMPORT]$':
      '[NAME OF MODULE YOU WANT TO IMPORT]/dist/cjs',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: { '\\.ts$': ['ts-jest'] },
};
