import { FastifyRequest, FastifyReply } from 'fastify';
import contestService from '../utils/contestService';

export const getAllContests = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const getAllContestsResponse: any = await contestService.getAllRecords();
  if (getAllContestsResponse.error) {
    return rep.status(400).send(getAllContestsResponse);
  }
  return { contestList: getAllContestsResponse.rows };
};

export const createContest = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;
  const createContestReponse: any = await contestService.createRecord(
    body.title,
    body.description,
    body.task_description,
    body.closed,
    body.author_uuid,
    body.contest_start,
    body.contest_stop,
    body.contest_type
  );

  if (createContestReponse.error) {
    return rep.status(400).send(createContestReponse);
  }
  return rep.status(201).send({ result: 'Created contest.' });
};

export const updateContest = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;
  const updateContestResponse: any = await contestService.updateRecord(
    body.uuid,
    body.title,
    body.description,
    body.task_description,
    body.closed,
    body.author_uuid,
    body.contest_start,
    body.contest_stop,
    body.contest_type
  );
  if (updateContestResponse.error) {
    return rep.status(400).send(updateContestResponse);
  }
  return rep.status(200).send({ result: 'Contest Updated.' });
};

export const deleteContest = async (req: FastifyRequest, rep: FastifyReply) => {
  const params: any = req.params;
  const deleteContestResponse: any = await contestService.deleteRecord(
    params.uuid
  );
  if (deleteContestResponse.error) {
    return rep.status(400).send(deleteContestResponse);
  }
  return rep.status(200).send({ result: 'Contest Deleted.' });
};
