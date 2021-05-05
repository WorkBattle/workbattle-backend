import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/submission/:uuid',
    handler: controller.getSubmission,
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
    method: 'POST',
    url: '/submission/:uuid/likes',
    handler: controller.updateLikes,
  },
  {
    method: 'POST',
    url: '/submission/:uuid/dislikes',
    handler: controller.updateLikes,
  },
];
