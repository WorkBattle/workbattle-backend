import { FastifyRequest, FastifyReply } from 'fastify';
import commentsService from '../commentsService';

export const getAllComments = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const params: any = req.params;
  const getAllCommentsResponse: any = await commentsService.getAllRecords(
    params.submission_uuid
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

export const updateComment = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;
  const updateCommentsResponse: any = await commentsService.updateRecord(
    body.uuid,
    body.text,
    body.submission_uuid,
    body.user_uuid
  );
  if (updateCommentsResponse.error) {
    return rep.status(400).send(updateCommentsResponse);
  }
  return rep.status(200).send({ result: 'Comment updated.' });
};

export const deleteComment = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;
  const deleteCommentResponse: any = await commentsService.deleteRecord(
    body.uuid
  );
  if (deleteCommentResponse.error) {
    return rep.status(400).send(deleteCommentResponse);
  }
  return rep.status(200).send({ result: 'Comment deleted.' });
};
