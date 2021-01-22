import { ExpressContext } from 'apollo-server-express';

export function context(context: ExpressContext) {
  const { req } = context,
    result = req.ip.match(/\d+\.\d+\.\d+\.\d+/),
    ip = result || '',
    session = req.session,
    username = session?.username;
  return {
    ip,
    session,
    // 通过session取得的用户名
    username,
  };
}

export interface Context {
  ip: string;
  session: Express.Session;
}
