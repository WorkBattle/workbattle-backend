import fastify, { FastifyInstance } from 'fastify';
import { IncomingMessage, request, Server, ServerResponse } from 'node:http';
import userService from './userManagment/utils/userService';

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

server.get('/', async (request, reply) => {
  reply.status(200).send('Hello World!');
});

export default server;
