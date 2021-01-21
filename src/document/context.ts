import { ExpressContext } from 'apollo-server-express';
import session from 'express-session';

export function context(context: ExpressContext) {
  const { req } = context;
  return {
    ip: req.ip.toString(),
    session: req.session,
  };
}

export interface Context {
  ip: string;
  session: session.Session & Partial<session.SessionData>;
}
