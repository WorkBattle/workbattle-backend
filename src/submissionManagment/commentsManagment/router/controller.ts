import { FastifyRequest, FastifyReply } from 'fastify';
import commentsService from '../commentsService';

export const getAllComments = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const params: any = req.params;
  const getAllCommentsResponse: any = await commentsService.getAllRecords(
    params.submission_uuid,
    params.user_uuid
  );
  if (getAllCommentsResponse.error) {
    return rep.status(400).send(getAllCommentsResponse);
  }
  return { contestList: getAllCommentsResponse.rows[0] };
};

export const createComment = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;
  const createCommentResponse: any = await commentsService.createRecord(
    body.text,
    body.submission_uuid,
    body.user_uuid
  );
  if (createCommentResponse.error) {
    return rep.status(400).send(createCommentResponse);
  }
  return rep.status(201).send({ result: 'Comment has been created.' });
};
