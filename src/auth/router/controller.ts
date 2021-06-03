import { FastifyRequest, FastifyReply } from 'fastify';
import userService from '../../userManagment/utils/userService';
import { hash, compare } from 'bcryptjs';
import { createToken } from '../utils/createToken';
import axios from 'axios';
import { authenticateWithLoginEmail } from '../utils/authenticateBasic';
import { authenticateWithGit } from '../utils/authenticateOAuth';

export const authLogin = async (req: FastifyRequest, rep: any) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const username = body.username;
  const email = body.email;
  const password = body.password;
  const authGitCode = body.code;

  let authenticate;

  if (authGitCode) {
    authenticate = await authenticateWithGit(authGitCode);
  } else {
    authenticate = await authenticateWithLoginEmail(password, username, email);
  }
  if (authenticate.error) {
    return rep
      .status(authenticate.error.status)
      .send(authenticate.error.result);
  }
  const user = authenticate.user;
  const refreashToken = createToken(
    user.uuid,
    '7d',
    process.env.REFRESH_TOKEN_SECRET!
  );
  const accessToken = createToken(
    user.uuid,
    '15m',
    process.env.ACCESS_TOKEN_SECRET!
  );
  rep.setCookie('jid', refreashToken, {
    httpOnly: true,
    path: '/',
    domain: '.workbattle.me',
  });
  return rep.status(200).send({ token: accessToken });
};

export const authRegister = async (req: FastifyRequest, rep: any) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const username = body.username;
  const email = body.email;
  if (!username || !email || !body.password) {
    return rep.status(400).send({
      error: 'Username or Email or Password is not presented in body request.',
    });
  }
  const password = await hash(body.password, 12);
  const { uuid, createRecordResponse }: any = await userService.createRecord(
    username,
    email,
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
    domain: '.workbattle.me',
  });

  return rep.status(201).send({ token: accessToken, userUuid: uuid });
};

export const authLoginGit = async (req: FastifyRequest, rep: any) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const requestToken = body.code;
  const getAccessTokenResponse = await axios.post(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GIT_CLIENT}&client_secret=${process.env.GIT_SECRET}&code=${requestToken}`,
    undefined,
    { headers: { accept: 'application/json' } }
  );
  const accessToken = JSON.parse(JSON.stringify(getAccessTokenResponse.data))
    .access_token;

  const getGitUserData = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + accessToken,
    },
  });
  return rep
    .status(200)
    .send({ result: JSON.parse(JSON.stringify(getGitUserData.data)) });
};

// 1) utils function to authorize with creds, function to authorize with git
// 2) add git name to a user model, check if the name that was given by git is already serving,
// then add git name to the newly created field and generate random characters after git
// username to serve as a login name.
// 3) Add posibility to change the password in user profile so person could login into system using login and password.
// 4) Add password recovery
// 5) Make auth as an external service (create a separate docker auth conteiner for better scaleability)
