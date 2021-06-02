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
    method: 'GET',
    url: '/contest/:uuid',
    handler: controller.getContest,
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
    schema: {
      body: {
        uuid: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        taskDescription: { type: 'string' },
        closed: { type: 'boolean' },
        authorUuid: { type: 'string' },
        contestStart: { type: 'object' },
        contestSrop: { type: 'object' },
        contestType: { type: 'string' },
      },
    },
  },
  {
    method: 'DELETE',
    url: '/contest/:uuid',
    handler: controller.deleteContest,
  },
];
