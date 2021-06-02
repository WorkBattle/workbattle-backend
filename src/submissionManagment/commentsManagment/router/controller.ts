import { FastifyRequest, FastifyReply } from 'fastify';
import { uploadFile } from '../../../aws/fileUtils';
import userService from '../../../userManagment/utils/userService';
import attachmentService from '../../attachmentManagment/attachmentService';
import commentsService from '../commentsService';

export const getAllComments = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
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
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const attachmentList64 = body.attachmentList;
  const {
    commentUuid,
    createRecordResponse,
  }: any = await commentsService.createRecord(
    body.text,
    body.submissionUuid,
    body.userUuid
  );
  if (createRecordResponse.error) {
    return rep.status(400).send(createRecordResponse);
  }
  if (attachmentList64 != undefined) {
    for (let attachment64 of attachmentList64) {
      let splitted = attachment64.split(',');
      let base64 = splitted[1];
      let extenstion = splitted[0].split(';')[0].split('/')[1];
      let {
        createRecordResponse,
        uuid,
      }: any = await attachmentService.createRecord(extenstion, commentUuid);
      if (createRecordResponse.error) {
        return rep.status(400).send(createRecordResponse);
      }
      console.log(uuid);
      uploadFile(Buffer.from(base64, 'base64'), `${uuid}.${extenstion}`);
    }
  }

  const getComment: any = await commentsService.getRecord(commentUuid);

  let commentResponse: { [key: string]: any } = getComment.rows[0];

  const getAttachmentResponse: any = await attachmentService.getRecord(
    commentUuid
  );

  let attachments = getAttachmentResponse.rows;

  if (attachments != []) {
    attachments = attachments.map((attachment: any) => {
      if (attachment.url != '') {
        attachment.url = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${attachment.url}`;
      }
      return attachment;
    });
  }
  commentResponse.attachments = attachments;

  const getUserResponse: any = await userService.getRecord(body.userUuid);
  if (getUserResponse.error) {
    return rep.status(400).send(getUserResponse);
  }
  let userData = getUserResponse.rows[0];
  delete userData.password;
  if (userData.avatar != '') {
    userData.avatar = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${userData.avatar}`;
  }
  commentResponse.user = userData;
  delete commentResponse.user_uuid;

  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    commentResponse['token'] = accessToken.access;
  }
  return rep.status(201).send(commentResponse);
};

export const updateComment = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
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
  rep.header('Access-Control-Allow-Credentials', 'true');
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
