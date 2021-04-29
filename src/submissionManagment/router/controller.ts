import { FastifyRequest, FastifyReply } from 'fastify';
import attachmentService from '../attachmentManagment/attachmentService';
import commentsService from '../commentsManagment/commentsService';
import likesService from '../likesManagment/likesService';
import submissionService from '../utils/submissionService';

export const getSubmission = async (req: FastifyRequest, rep: FastifyReply) => {
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
        attachment.url = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${attachment.url}`;
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
  return rep.status(200).send({
    submission: getSubmissionResponse.rows[0],
    commentsList: awaittedComments,
  });
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
    body.content_type,
    body.user_uuid,
    body.contest_uuid,
    uuid,
    body.content_url,
    body.file_url,
    body.repo_url
  );
  if (createSubmissionResponse.error) {
    return rep.status(400).send(createSubmissionResponse);
  }
  return rep.status(201).send({ result: 'Submission has been created.' });
};

export const updateSubmission = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const body: any = req.body;
  const updateSubmissionResponse: any = await submissionService.updateRecord(
    body.uuid,
    body.contest_type,
    body.user_uuid,
    body.contest_uuid,
    body.likes_uuid,
    body.contest_url,
    body.file_url,
    body.repo_url
  );
  if (updateSubmissionResponse.error) {
    return rep.status(400).send(updateSubmissionResponse);
  }
  return rep.status(200).send({ result: 'Submission updated.' });
};

export const deleteSubmission = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
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
  return rep.status(200).send({ result: 'Submission deleted.' });
};

export const updateLikes = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;
  const updateLikesResponse: any = await likesService.updateRecord(
    body.uuid,
    body.likes,
    body.dislikes
  );
  if (updateLikesResponse.error) {
    return rep.status(400).send(updateLikesResponse);
  }
  return rep.status(200).send({ result: 'Likes updated.' });
};
