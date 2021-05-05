import { RouteOptions, RegisterOptions } from 'fastify';
import { isAuth } from '../../auth/router/hook';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/user/:uuid',
    handler: controller.getUser,
  },
  {
    method: 'GET',
    url: '/user/getInfo',
    handler: controller.getInfo,
  },
  {
    method: 'POST',
    url: '/user',
    handler: controller.createUser,
  },
  {
    method: 'PATCH',
    url: '/user',
    handler: controller.updateUser,
  },
  {
    method: 'DELETE',
    url: '/user/:uuid',
    handler: controller.deleteUser,
  },
];
