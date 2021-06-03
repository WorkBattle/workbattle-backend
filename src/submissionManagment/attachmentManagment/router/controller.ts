import { FastifyRequest, FastifyReply } from 'fastify';
import { checkIfExists, deleteFile, uploadFile } from '../../../aws/fileUtils';
import attachmentService from '../attachmentService';

export const getAllAttachments = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const params: any = req.params;
  const getCommentResponse: any = await attachmentService.getAllRecords(
    params.uuid
  );
  if (getCommentResponse.error) {
    return rep.status(400).send(getCommentResponse);
  }
  let comments = getCommentResponse.rows;
  if (comments != []) {
    comments = comments.map((comment: any) => {
      if (comment.url != '') {
        comment.url = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${comment.url}`;
      }
      return comment;
    });
  }
  let attachmentResponse: { [key: string]: any } = {
    attachmentList: getCommentResponse.rows,
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    attachmentResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(attachmentResponse);
};

// TODO: Add Multiple attachment support
export const createAttachment = async (req: any, rep: FastifyReply) => {
  const body: any = req.body;
  const attachment64 = body.attachment64;

  const {
    createAttachmentResponse,
    uuid,
  }: any = await attachmentService.createRecord(body.url, body.commentUuid);
  if (createAttachmentResponse.error) {
    return rep.status(400).send(createAttachmentResponse);
  }

  if (attachment64 != undefined && body.url != '') {
    uploadFile(Buffer.from(attachment64, 'base64'), `${uuid}/${body.url}`);
  }
  let attachmentResponse: { [key: string]: any } = {
    result: 'Attachment has been created.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    attachmentResponse['token'] = accessToken.access;
  }
  rep.header('Access-Control-Allow-Credentials', 'true');
  return rep.status(201).send(attachmentResponse);
};

export const updateAttachment = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const attachment64 = body.attachment64;
  const {
    updateAttachmentResponse,
    getAttachmentUrlResponse,
  }: any = await attachmentService.updateRecord(
    body.uuid,
    body.url,
    body.commentUuid
  );
  if (updateAttachmentResponse.error) {
    return rep.status(400).send(updateAttachmentResponse);
  }
  if (getAttachmentUrlResponse.error) {
    return rep.status(400).send(getAttachmentUrlResponse);
  }
  if (body.url == '') {
    try {
      await deleteFile(body.url);
    } catch (err) {
      return rep.status(400).send(err.code);
    }
  } else {
    if (attachment64 != undefined) {
      const exists = checkIfExists(getAttachmentUrlResponse.rows[0].url);
      if (!exists.error) {
        await deleteFile(getAttachmentUrlResponse.rows[0].url);
      }
      uploadFile(Buffer.from(attachment64, 'base64'), body.url);
    }
  }
  let attachmentResponse: { [key: string]: any } = {
    result: 'Attachment updated.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    attachmentResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(attachmentResponse);
};

export const deleteAttachment = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const params: any = req.params;
  const {
    deleteAttachmentResponse,
    urlResponse,
  }: any = await attachmentService.deleteRecord(params.uuid);
  if (deleteAttachmentResponse.error) {
    return rep.status(400).send(deleteAttachmentResponse);
  }
  if (urlResponse.error) {
    return rep.status(400).send(urlResponse);
  }
  if (urlResponse.rows[0].avatar != '') {
    await deleteFile(urlResponse.rows[0].url);
  }
  let attachmentResponse: { [key: string]: any } = {
    result: 'Attachment deleted.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    attachmentResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(attachmentResponse);
};
