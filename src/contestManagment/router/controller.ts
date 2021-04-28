import { FastifyRequest, FastifyReply } from 'fastify';
import submissionService from '../../submissionManagment/utils/submissionService';
import userService from '../../userManagment/utils/userService';
import contestService from '../utils/contestService';

export const getContest = async (req: FastifyRequest, rep: FastifyReply) => {
  const params: any = req.params;
  const getContestResponse: any = await contestService.getRecord(params.uuid);

  if (getContestResponse.error) {
    return rep.status(400).send(getContestResponse);
  }
  const getAllSubmissionsResponse: any = await submissionService.getAllRecords(
    params.uuid
  );
  if (getAllSubmissionsResponse.error) {
    return rep.status(400).send(getAllSubmissionsResponse);
  }
  let contestDetailsObject = getContestResponse.rows[0];
  let allSubmissions = getAllSubmissionsResponse.rows;
  allSubmissions = allSubmissions.map(async (submissionObject: any) => {
    const user_uuid = submissionObject.author_uuid;
    const getUserResponse: any = await userService.getRecord(user_uuid);
    if (getUserResponse.error) {
      return rep.status(400).send(getUserResponse);
    }
    let userData = getUserResponse.rows[0];
    userData.avatar = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${userData.avatar}`;
    submissionObject.user = userData;
    return submissionObject;
  });
  return rep.status(200).send({
    contest: contestDetailsObject,
    submissionList: allSubmissions,
  });
};

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
