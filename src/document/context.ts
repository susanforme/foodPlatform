import { ExpressContext } from 'apollo-server-express';
import e from 'express';

export function context(context: ExpressContext) {
  const { req } = context,
    result = (req.get('remote-host') || req.get('X-Real-IP') || req.ip).match(
      /\d+\.\d+\.\d+\.\d+/,
    ),
    ip = result || '',
    session = req.session;
  return {
    ip,
    session,
    req,
  };
}

export interface Context {
  ip: string;
  session: Express.Session;
  req: e.Request;
}
