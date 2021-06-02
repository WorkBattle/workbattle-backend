import fastify, { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import registerApi from './server/index';

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true, bodyLimit: 10485760 });

registerApi(server);

export default {
  server,
  async init() {
    await server.listen(process.env.PORT!, process.env.HOST);
  },
};
