import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/contests',
    handler: controller.getAllContests,
  },
  {
    method: 'POST',
    url: '/contest',
    handler: controller.createContest,
  },
  {
    method: 'PATCH',
    url: '/contest',
    handler: controller.updateContest,
  },
  {
    method: 'DELETE',
    url: '/contest/:uuid',
    handler: controller.deleteContest,
  },
];
