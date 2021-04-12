import { Handler, withIronSession } from 'next-iron-session';

export default function withSession(handler: Handler) {
  return withIronSession(handler, {
    password: process.env.SESSION_PASSWORD || '',
    cookieName: 'session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}
