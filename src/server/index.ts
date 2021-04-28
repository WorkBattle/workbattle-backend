import { FastifyInstance, FastifyPluginOptions, RouteOptions } from 'fastify';
import { Server } from 'http';
import * as contest from '../contestManagment/router';
import * as user from '../userManagment/router';
import * as submission from '../submissionManagment/router';
import * as comment from '../submissionManagment/commentsManagment/router';
import * as attachment from '../submissionManagment/attachmentManagment/router';

const routers: any[] = [contest, user, submission, comment, attachment];

export default (server: FastifyInstance<Server>) => {
  server.register(require('fastify-cors'), {
    origin: true,
  });
  routers.forEach((router) => {
    const { routes, opts } = router;

    const plugin = (
      server: FastifyInstance,
      opts: FastifyPluginOptions,
      done: () => unknown
    ) => {
      routes.forEach((route: RouteOptions) => server.route(route));
      done();
    };

    server.register(plugin, opts);
  });
};
