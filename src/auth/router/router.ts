import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/auth',
};

export const routes: RouteOptions[] = [
  {
    method: 'POST',
    url: '/login',
    handler: controller.authLogin,
  },
  {
    method: 'POST',
    url: '/github',
    handler: controller.authLoginGit,
  },
  {
    method: 'POST',
    url: '/register',
    handler: controller.authRegister,
  },
];
