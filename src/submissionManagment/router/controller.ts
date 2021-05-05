import { FastifyRequest, FastifyReply } from 'fastify';
import attachmentService from '../attachmentManagment/attachmentService';
import commentsService from '../commentsManagment/commentsService';
import likesService from '../likesManagment/likesService';
import submissionService from '../utils/submissionService';
import { toCamel } from 'snake-camel';

export const getSubmission = async (req: any, rep: FastifyReply) => {
  const params: any = req.params;
  const getSubmissionResponse: any = await submissionService.getRecord(
    params.uuid
  );
  if (getSubmissionResponse.error) {
    return rep.status(400).send(getSubmissionResponse);
  }
  const getAllCommentsResponse: any = await commentsService.getAllRecords(
    params.uuid
  );
  if (getAllCommentsResponse.error) {
    return rep.status(400).send(getAllCommentsResponse);
  }
  let submission = getSubmissionResponse.rows[0];
  const getLikesResponse: any = await likesService.getRecord(
    submission.likes_uuid
  );
  submission.likes = getLikesResponse.rows[0].likes;
  submission.dislikes = getLikesResponse.rows[0].dislikes;
  submission.liked = true;
  delete submission.likes_uuid;
  let commentsList = getAllCommentsResponse.rows;
  commentsList = commentsList.map(async (comment: any) => {
    const commentUuid = comment.uuid;
    const getAttachmentResponse: any = await attachmentService.getRecord(
      commentUuid
    );
    if (getAttachmentResponse.error) {
      return rep.status(400).send(getAttachmentResponse);
    }
    let attachments = getAttachmentResponse.rows;
    if (attachments != []) {
      attachments = attachments.map((attachment: any) => {
        if (attachment.url != '') {
          attachment.url = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${attachment.url}`;
        }
        return attachment;
      });
    }
    comment.attachments = attachments;
    return comment;
  });
  let awaittedComments: any = [];
  for (let comment of commentsList) {
    awaittedComments.push(await comment);
  }
  let submissionResponse: { [key: string]: any } = {
    submission: submission,
    commentsList: awaittedComments,
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    submissionResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(toCamel(submissionResponse));
};

export const createSubmission = async (req: any, rep: FastifyReply) => {
  const body: any = req.body;
  const { createLikesResponse, uuid } = await likesService.createRecord(0, 0);
  if (createLikesResponse.error) {
    return rep.status(400).send(createLikesResponse);
  }
  const createSubmissionResponse: any = await submissionService.createRecord(
    body.contentType,
    body.userUuid,
    body.contestUuid,
    uuid,
    body.contentUrl,
    body.fileUrl,
    body.repoUrl
  );
  if (createSubmissionResponse.error) {
    return rep.status(400).send(createSubmissionResponse);
  }
  let submissionResponse: { [key: string]: any } = {
    result: 'Submission has been created.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    submissionResponse['token'] = accessToken.access;
  }
  return rep.status(201).send(submissionResponse);
};

export const updateSubmission = async (req: any, rep: FastifyReply) => {
  const body: any = req.body;
  const updateSubmissionResponse: any = await submissionService.updateRecord(
    body.uuid,
    body.contesType,
    body.userUuid,
    body.contestUuid,
    body.likesUuid,
    body.contestUrl,
    body.fileUrl,
    body.repoUrl
  );
  if (updateSubmissionResponse.error) {
    return rep.status(400).send(updateSubmissionResponse);
  }
  let submissionResponse: { [key: string]: any } = {
    result: 'Submission updated.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    submissionResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(submissionResponse);
};

export const deleteSubmission = async (req: any, rep: FastifyReply) => {
  const body: any = req.body;
  const {
    deleteSubmissionResponse,
    getLikesUUIDResponse,
  }: any = await submissionService.deleteRecord(body.uuid);
  if (deleteSubmissionResponse.error) {
    return rep.status(400).send(deleteSubmissionResponse);
  }
  if (getLikesUUIDResponse.error) {
    return rep.status(400).send(getLikesUUIDResponse);
  }
  const deleteRelatedLikesRelationResponse: any = await likesService.deleteRecord(
    getLikesUUIDResponse.rows[0].likes_uuid
  );
  if (deleteRelatedLikesRelationResponse.error) {
    return rep.status(400).send(deleteRelatedLikesRelationResponse);
  }
  let submissionResponse: { [key: string]: any } = {
    result: 'Submission deleted.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    submissionResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(submissionResponse);
};

export const updateLikes = async (req: any, rep: FastifyReply) => {
  const params: any = req.params;
  const getSubmissionResponse: any = await submissionService.getRecord(
    params.uuid
  );
  const getLikesResponse: any = await likesService.getRecord(
    getSubmissionResponse.rows[0].likes_uuid
  );
  const updateLikesResponse: any = await likesService.updateRecord(
    getSubmissionResponse.rows[0].likes_uuid,
    getLikesResponse.rows[0].likes + 1
  );
  if (updateLikesResponse.error) {
    return rep.status(400).send(updateLikesResponse);
  }
  let submissionResponse: { [key: string]: any } = {
    result: 'Likes updated.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    submissionResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(submissionResponse);
};
export const updateDislikes = async (req: any, rep: FastifyReply) => {
  const params: any = req.params;
  const getSubmissionResponse: any = await submissionService.getRecord(
    params.uuid
  );
  const getLikesResponse: any = await likesService.getRecord(
    getSubmissionResponse.rows[0].likes_uuid
  );
  const updateLikesResponse: any = await likesService.updateRecord(
    getLikesResponse.rows[0].uuid,
    getLikesResponse.rows[0].dislikes + 1
  );
  if (updateLikesResponse.error) {
    return rep.status(400).send(updateLikesResponse);
  }
  let submissionResponse: { [key: string]: any } = {
    result: 'Likes updated.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    submissionResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(submissionResponse);
};
