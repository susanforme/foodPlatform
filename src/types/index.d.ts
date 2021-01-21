import 'express-session';

// 解决声明合并问题
declare module 'express-session' {
  export interface SessionData {
    [key: string]: string;
  }
}
