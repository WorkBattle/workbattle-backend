import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/submissions',
    handler: controller.getAllSubmissions,
  },
  {
    method: 'POST',
    url: '/submission',
    handler: controller.createSubmission,
  },
];
