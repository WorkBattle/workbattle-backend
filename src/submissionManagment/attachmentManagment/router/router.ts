import { RouteOptions, RegisterOptions } from 'fastify';
import * as controller from './controller';

export const opts: RegisterOptions = {
  prefix: 'api/v1/',
};

export const routes: RouteOptions[] = [
  {
    method: 'GET',
    url: '/attachments/:uuid',
    handler: controller.getAllAttachments,
  },
  {
    method: 'POST',
    url: '/attachment',
    handler: controller.createAttachment,
  },
  {
    method: 'PATCH',
    url: '/attachment',
    handler: controller.updateAttachment,
  },
  {
    method: 'DELETE',
    url: '/attachment/:uuid',
    handler: controller.deleteAttachment,
  },
];
