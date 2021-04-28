import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/submissions/:contest_uuid',
    handler: controller.getAllSubmissions,
  },
  {
    method: 'POST',
    url: '/submission',
    handler: controller.createSubmission,
  },
  {
    method: 'PATCH',
    url: '/submission',
    handler: controller.updateSubmission,
  },
  {
    method: 'DELETE',
    url: '/submission',
    handler: controller.deleteSubmission,
  },
  {
    method: 'PATCH',
    url: '/submission/likes',
    handler: controller.updateLikes,
  },
];
