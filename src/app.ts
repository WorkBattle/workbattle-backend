import fastify, { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'node:http';

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

server.get('/', async (request, reply) => {
  reply.status(200).send('Hello World!');
});

export default server;
