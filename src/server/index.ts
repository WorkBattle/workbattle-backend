import { FastifyInstance, FastifyPluginOptions, RouteOptions } from 'fastify';
import { Server } from 'http';
import { fastifyRequestContextPlugin } from 'fastify-request-context';
import * as contest from '../contestManagment/router';
import * as user from '../userManagment/router';
import * as submission from '../submissionManagment/router';
import * as comment from '../submissionManagment/commentsManagment/router';
import * as attachment from '../submissionManagment/attachmentManagment/router';
import * as auth from '../auth/router';
import { aplyIsAuthOnRequestHook } from './utils/aplyHooks';

const routers: any[] = [contest, user, submission, comment, attachment, auth];

export default (server: FastifyInstance<Server>) => {
  server.register(require('fastify-cors'), {
    origin: true,
  });
  server.register(require('fastify-cookie'), {
    secret: process.env.COOKIE_SECRET,
  });
  server.register(fastifyRequestContextPlugin);
  routers.forEach((router) => {
    let { routes, opts } = router;

    if (router != auth) routes = aplyIsAuthOnRequestHook(routes);

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
