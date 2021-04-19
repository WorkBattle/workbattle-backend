import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/user:uuid',
    handler: controller.getUser,
  },
  {
    method: 'POST',
    url: '/user',
    handler: controller.createUser,
  },
];
