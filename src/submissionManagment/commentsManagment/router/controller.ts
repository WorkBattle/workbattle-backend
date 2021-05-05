import { FastifyRequest, FastifyReply } from 'fastify';
import commentsService from '../commentsService';

export const getAllComments = async (req: any, rep: FastifyReply) => {
  const params: any = req.params;
  const getAllCommentsResponse: any = await commentsService.getAllRecords(
    params.submission_uuid
  );
  if (getAllCommentsResponse.error) {
    return rep.status(400).send(getAllCommentsResponse);
  }
  let commentResponse: { [key: string]: any } = {
    contestList: getAllCommentsResponse.rows[0],
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    commentResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(commentResponse);
};

export const createComment = async (req: any, rep: FastifyReply) => {
  const body: any = req.body;
  const createCommentResponse: any = await commentsService.createRecord(
    body.text,
    body.submissionUuid,
    body.userUuid
  );
  if (createCommentResponse.error) {
    return rep.status(400).send(createCommentResponse);
  }
  let commentResponse: { [key: string]: any } = {
    result: 'Comment has been created.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    commentResponse['token'] = accessToken.access;
  }
  return rep.status(201).send(commentResponse);
};

export const updateComment = async (req: any, rep: FastifyReply) => {
  const body: any = req.body;
  const updateCommentsResponse: any = await commentsService.updateRecord(
    body.uuid,
    body.text,
    body.submissionUuid,
    body.userUuid
  );
  if (updateCommentsResponse.error) {
    return rep.status(400).send(updateCommentsResponse);
  }
  let commentResponse: { [key: string]: any } = {
    result: 'Comment updated.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    commentResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(commentResponse);
};

export const deleteComment = async (req: any, rep: FastifyReply) => {
  const body: any = req.body;
  const deleteCommentResponse: any = await commentsService.deleteRecord(
    body.uuid
  );
  if (deleteCommentResponse.error) {
    return rep.status(400).send(deleteCommentResponse);
  }
  let commentResponse: { [key: string]: any } = {
    result: 'Comment deleted.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    commentResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(commentResponse);
};
