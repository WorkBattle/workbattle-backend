import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/transaction/:user_uuid',
    handler: controller.getAllTransaction,
  },
  {
    method: 'POST',
    url: '/transaction',
    handler: controller.createTransaction,
  },
];
