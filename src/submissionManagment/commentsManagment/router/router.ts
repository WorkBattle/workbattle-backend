import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/comments/:submission_uuid/:user_uuid',
    handler: controller.getAllComments,
  },
  {
    method: 'POST',
    url: '/comment',
    handler: controller.createComment,
  },
  {
    method: 'PATCH',
    url: '/comment',
    handler: controller.updateComment,
  },
  {
    method: 'DELETE',
    url: '/comment',
    handler: controller.deleteComment,
  },
];
