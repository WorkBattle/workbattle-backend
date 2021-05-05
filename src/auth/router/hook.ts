import { FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';
import { createToken } from '../utils/createToken';
export function isAuth(req: any, rep: FastifyReply, done: any) {
  const auth = req.headers.authorization;
  try {
    const payload = verify(
      auth.split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET!
    );
    done();
    return;
  } catch (errAccess) {
    const cookieToken = req.cookies.jid;
    try {
      const payload: any = verify(
        cookieToken,
        process.env.REFRESH_TOKEN_SECRET!
      );
      const accessToken = createToken(
        payload.userUuid,
        '15m',
        process.env.ACCESS_TOKEN_SECRET!
      );
      req.requestContext.set('token', { access: accessToken });
      done();
      return;
    } catch (errRefreash) {
      return rep.status(403).send({ error: 'User is not authorize.' });
    }
  }
}
