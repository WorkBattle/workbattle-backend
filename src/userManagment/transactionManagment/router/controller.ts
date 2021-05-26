import { FastifyRequest, FastifyReply } from 'fastify';
import transactionService from '../transactionService';

export const getAllTransaction = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const params: any = req.params;
  const getTransactionResponse: any = await transactionService.getAllRecords(
    params.user_uuid
  );
  if (getTransactionResponse.error) {
    return rep.status(400).send(getTransactionResponse);
  }
  return { user: getTransactionResponse.rows[0] };
};

export const createTransaction = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const createTransactionResponse: any = await transactionService.createRecord(
    new Date(),
    body.info,
    body.user_uuid
  );
  if (createTransactionResponse.error) {
    return rep.status(400).send(createTransactionResponse);
  }
  return rep.status(201).send({ result: 'transaction created' });
};
