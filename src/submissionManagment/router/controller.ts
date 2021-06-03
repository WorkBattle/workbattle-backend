import { FastifyRequest, FastifyReply } from 'fastify';
import attachmentService from '../attachmentManagment/attachmentService';
import commentsService from '../commentsManagment/commentsService';
import likesService from '../likesManagment/likesService';
import submissionService from '../utils/submissionService';
import { toCamel } from 'snake-camel';
import userService from '../../userManagment/utils/userService';
import contestService from '../../contestManagment/utils/contestService';
import { uploadFile } from '../../aws/fileUtils';

export const getSubmission = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
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
  // submission.liked = true;
  delete submission.likes_uuid;

  const user_uuid = submission.user_uuid;
  const currentUserUuid = req.requestContext.get('user').uuid;

  const isLiked: any = await likesService.IsLikeOrDislike(
    getLikesResponse.rows[0].uuid,
    currentUserUuid,
    true
  );
  if (isLiked.error) {
    return rep.status(400).send(isLiked);
  }
  if (isLiked.rows.length != 0) {
    submission.liked = true;
  } else {
    submission.liked = false;
    const isDiliked: any = await likesService.IsLikeOrDislike(
      getLikesResponse.rows[0].uuid,
      currentUserUuid,
      false
    );
    if (isDiliked.error) {
      return rep.status(400).send(isLiked);
    }
    if (isDiliked.rows.length != 0) {
      submission.disliked = true;
    } else {
      submission.disliked = false;
    }
  }

  const getUserResponse: any = await userService.getRecord(user_uuid);
  if (getUserResponse.error) {
    return rep.status(400).send(getUserResponse);
  }
  let userData = getUserResponse.rows[0];
  delete userData.password;
  if (userData.avatar != '') {
    userData.avatar = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${userData.avatar}`;
  }
  submission.user = userData;
  delete submission.user_uuid;

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
    let awComment = await comment;
    const user_uuid = awComment.user_uuid;
    const getUserResponse: any = await userService.getRecord(user_uuid);
    if (getUserResponse.error) {
      return rep.status(400).send(getUserResponse);
    }
    let userData = getUserResponse.rows[0];
    delete userData.password;
    if (userData.avatar != '') {
      userData.avatar = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${userData.avatar}`;
    }
    awComment.user = userData;
    delete awComment.user_uuid;
    awaittedComments.push(awComment);
  }
  let submissionResponse: { [key: string]: any } = {
    submission: submission,
    commentsList: awaittedComments,
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    submissionResponse['token'] = accessToken.access;
  }
  console.log(submissionResponse);
  if (submissionResponse.submission.file_url != undefined) {
    submissionResponse.submission.file_url = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${submissionResponse.submission.file_url}`;
  }
  return rep.status(200).send(toCamel(submissionResponse));
};

export const createSubmission = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const userUuid = body.userUuid;
  const contestUuid = body.contestUuid;
  const getContestResponse: any = await contestService.getRecord(contestUuid);
  if (getContestResponse.error) {
    return rep.status(400).send(getContestResponse);
  }
  if (userUuid == getContestResponse.rows[0].author_uuid) {
    return rep
      .status(400)
      .send({ error: 'Author of contest cannot create submission.' });
  }
  const { createLikesResponse, uuid } = await likesService.createRecord(0, 0);
  if (createLikesResponse.error) {
    return rep.status(400).send(createLikesResponse);
  }
  let fileUrl = body.fileUrl;
  let base64;
  let extenstion;
  if (body.contentType == 'file') {
    let splitted = body.file.split(',');
    base64 = splitted[1];
    extenstion = splitted[0].split(';')[0].split('/')[1];
    fileUrl = extenstion;
  }
  const {
    submissionUuid,
    createRecordResponse,
  }: any = await submissionService.createRecord(
    body.contentType,
    userUuid,
    contestUuid,
    uuid,
    body.contentUrl,
    fileUrl,
    body.repoUrl
  );
  if (createRecordResponse.error) {
    return rep.status(400).send(createRecordResponse);
  }
  if (body.contentType == 'file') {
    uploadFile(
      Buffer.from(base64, 'base64'),
      `${submissionUuid}.${extenstion}`
    );
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
  rep.header('Access-Control-Allow-Credentials', 'true');
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
  rep.header('Access-Control-Allow-Credentials', 'true');
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
  rep.header('Access-Control-Allow-Credentials', 'true');
  const params: any = req.params;
  const userUuid = req.requestContext.get('user').uuid;
  const getSubmissionResponse: any = await submissionService.getRecord(
    params.uuid
  );
  if (getSubmissionResponse.error) {
    return rep.status(400).send(getSubmissionResponse);
  }
  const likesDislikesUuid = getSubmissionResponse.rows[0].likes_uuid;
  const checkIfLiked: any = await likesService.IsLikeOrDislike(
    likesDislikesUuid,
    userUuid,
    true
  );
  if (checkIfLiked.rows.length != 0 && !req.body?.delete) {
    return rep.status(400).send({});
  }
  if (req.body.delete == true) {
    const deleteLikeResponse: any = await likesService.deleteLikesOrDislikeRecord(
      likesDislikesUuid,
      userUuid,
      true
    );
    if (deleteLikeResponse.error) {
      return rep.status(400).send(deleteLikeResponse);
    }
    return rep.status(200).send({});
  }
  const checkIfDisliked: any = await likesService.IsLikeOrDislike(
    likesDislikesUuid,
    userUuid,
    false
  );
  if (checkIfDisliked.rows.length !== 0) {
    const deleteDislikeResponse: any = await likesService.deleteLikesOrDislikeRecord(
      likesDislikesUuid,
      userUuid,
      false
    );
    if (deleteDislikeResponse.error) {
      return rep.status(400).send(deleteDislikeResponse);
    }
  }
  const createLikeResponse: any = await likesService.createLikesOrDislikesRecord(
    likesDislikesUuid,
    userUuid,
    true
  );
  if (createLikeResponse.error) {
    return rep.status(400).send(createLikeResponse);
  }
  return rep.status(200).send({});
};
export const updateDislikes = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const params: any = req.params;
  const userUuid = req.requestContext.get('user').uuid;
  const getSubmissionResponse: any = await submissionService.getRecord(
    params.uuid
  );
  if (getSubmissionResponse.error) {
    return rep.status(400).send(getSubmissionResponse);
  }
  const likesDislikesUuid = getSubmissionResponse.rows[0].likes_uuid;
  const checkIfDisliked: any = await likesService.IsLikeOrDislike(
    likesDislikesUuid,
    userUuid,
    false
  );
  if (checkIfDisliked.rows.length != 0 && !req.body?.delete) {
    return rep.status(400).send({});
  }
  if (req.body.delete == true) {
    const deleteDislikeResponse: any = await likesService.deleteLikesOrDislikeRecord(
      likesDislikesUuid,
      userUuid,
      false
    );
    if (deleteDislikeResponse.error) {
      return rep.status(400).send(deleteDislikeResponse);
    }
    return rep.status(200).send({});
  }

  const checkIfLiked: any = await likesService.IsLikeOrDislike(
    likesDislikesUuid,
    userUuid,
    true
  );
  if (checkIfLiked.rows.length != 0) {
    const deleteLikeResponse: any = await likesService.deleteLikesOrDislikeRecord(
      likesDislikesUuid,
      userUuid,
      true
    );
    if (deleteLikeResponse.error) {
      return rep.status(400).send(deleteLikeResponse);
    }
  }
  const createDislikeResponse: any = await likesService.createLikesOrDislikesRecord(
    likesDislikesUuid,
    userUuid,
    false
  );
  if (createDislikeResponse.error) {
    return rep.status(400).send(createDislikeResponse);
  }
  return rep.status(200).send({});
};
