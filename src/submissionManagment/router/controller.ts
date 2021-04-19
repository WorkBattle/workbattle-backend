import { FastifyRequest, FastifyReply } from 'fastify';
import likesService from '../likesManagment/likesService';
import submissionService from '../utils/submissionService';

export const getAllSubmissions = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const params: any = req.params;
  const getAllSubmissionsResponse: any = await submissionService.getAllRecords(
    params.contest_uuid,
    params.user_uuid
  );
  if (getAllSubmissionsResponse.error) {
    return rep.status(400).send(getAllSubmissionsResponse);
  }
  return { contestList: getAllSubmissionsResponse.rows[0] };
};

export const createSubmission = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const body: any = req.body;
  const { createLikesResponse, uuid } = await likesService.createRecord(0, 0);
  if (createLikesResponse.error) {
    return rep.status(400).send(createLikesResponse);
  }
  const createSubmissionResponse: any = await submissionService.createRecord(
    body.contest_type,
    body.user_uuid,
    body.contest_uuid,
    uuid,
    body.contest_url,
    body.file_url,
    body.repo_url
  );
  if (createSubmissionResponse.error) {
    return rep.status(400).send(createSubmissionResponse);
  }
  return rep.status(201).send({ result: 'Submission has been created.' });
};
