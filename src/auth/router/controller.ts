import { FastifyRequest, FastifyReply } from 'fastify';
import userService from '../../userManagment/utils/userService';
import { hash, compare } from 'bcryptjs';
import { createToken } from '../utils/createToken';

export const authLogin = async (req: FastifyRequest, rep: any) => {
  const body: any = req.body;
  const username = body.username;
  const email = body.email;
  const password = body.password;
  const getUserResponse: any = await userService.getRecord('', username, email);
  if (getUserResponse.error) {
    return rep.status(400).send(getUserResponse);
  }
  if (getUserResponse.rows.length == 0) {
    return rep.status(404).send({ error: 'User not found.' });
  }
  const verifyPass = await compare(password, getUserResponse.rows[0].password);
  if (!verifyPass) {
    return rep.status(401).send({ error: 'Invalid Password.' });
  }
  const refreashToken = createToken(
    getUserResponse.rows[0].uuid,
    '7d',
    process.env.REFRESH_TOKEN_SECRET!
  );
  const accessToken = createToken(
    getUserResponse.rows[0].uuid,
    '15m',
    process.env.ACCESS_TOKEN_SECRET!
  );
  rep.setCookie('jid', refreashToken, {
    httpOnly: true,
    path: '/',
  });
  return rep.status(200).send({ token: accessToken });
};

export const authRegister = async (req: FastifyRequest, rep: any) => {
  const body: any = req.body;
  const password = await hash(body.password, 12);
  const { uuid, createRecordResponse }: any = await userService.createRecord(
    body.username,
    body.email,
    password
  );
  if (createRecordResponse.error) {
    return rep.status(400).send(createRecordResponse);
  }

  const refreashToken = createToken(
    uuid,
    '7d',
    process.env.REFRESH_TOKEN_SECRET!
  );
  const accessToken = createToken(
    uuid,
    '15m',
    process.env.ACCESS_TOKEN_SECRET!
  );
  rep.setCookie('jid', refreashToken, {
    httpOnly: true,
    path: '/',
  });

  return rep.status(201).send({ token: accessToken, userUuid: uuid });
};
