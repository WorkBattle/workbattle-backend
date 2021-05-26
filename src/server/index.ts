import { FastifyInstance, FastifyPluginOptions, RouteOptions } from 'fastify';
import { Server } from 'http';
import { fastifyRequestContextPlugin } from 'fastify-request-context';
import * as contest from '../contestManagment/router';
import * as user from '../userManagment/router';
import * as submission from '../submissionManagment/router';
import * as comment from '../submissionManagment/commentsManagment/router';
import * as attachment from '../submissionManagment/attachmentManagment/router';
import * as auth from '../auth/router';
import { aplyIsAuthPreValidationHook } from './utils/aplyHooks';

const routers: any[] = [contest, user, submission, comment, attachment, auth];

export default (server: FastifyInstance<Server>) => {
  server.register(require('fastify-cors'), {
    origin: 'localhost:4200',
  });
  server.register(require('fastify-cookie'), {
    secret: process.env.COOKIE_SECRET,
  });
  server.register(fastifyRequestContextPlugin);
  server.register(require('fastify-swagger'), {
    swagger: {
      info: {
        title: 'Swagger for API integratoin',
        description: 'testing the fastify swagger api',
        version: '0.1.0',
      },
      host: 'localhost',
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    exposeRoute: true,
  });
  routers.forEach((router) => {
    let { routes, opts } = router;

    if (router != auth) routes = aplyIsAuthPreValidationHook(routes);

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
