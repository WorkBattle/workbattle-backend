import { FastifyRequest, FastifyReply } from 'fastify';
import transactionService from '../transactionService';

export const getAllTransaction = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const getUserResponse: any = await transactionService.getAllRecords();
  if (getUserResponse.error) {
    return rep.status(400).send(getUserResponse);
  }
  return { user: getUserResponse.rows[0] };
};
