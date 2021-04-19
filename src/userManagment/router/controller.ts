import { FastifyRequest, FastifyReply } from 'fastify';
import userService from '../utils/userService';

export const getUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const params: any = req.params;
  const userUuid = params.uuid;
  const getUserResponse: any = await userService.getRecord(userUuid);
  if (getUserResponse.error) {
    return rep.status(400).send(getUserResponse);
  }
  return { user: getUserResponse.rows[0] };
};

export const createUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;

  const createUserResponse: any = await userService.createRecord(
    body.username,
    body.email,
    body.password,
    body.firstname,
    body.lastname,
    body.role,
    body.balance,
    body.avatar
  );
  if (createUserResponse.error) {
    return rep.status(400).send(createUserResponse);
  }
  return rep.status(201).send({ result: 'User has been created.' });
};
