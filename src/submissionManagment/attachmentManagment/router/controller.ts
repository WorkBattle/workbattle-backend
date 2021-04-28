import { FastifyRequest, FastifyReply } from 'fastify';
import { checkIfExists, deleteFile, uploadFile } from '../../../aws/fileUtils';
import attachmentService from '../attachmentService';

export const getAllAttachments = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const params: any = req.params;
  const getCommentResponse: any = await attachmentService.getAllRecords(
    params.uuid
  );
  if (getCommentResponse.error) {
    return rep.status(400).send(getCommentResponse);
  }
  return rep.status(200).send({ attachmentList: getCommentResponse.rows });
};

export const createAttachment = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const body: any = req.body;
  const attachment64 = body.attachment64;

  const {
    createAttachmentResponse,
    uuid,
  }: any = await attachmentService.createRecord(body.url, body.comment_uuid);
  if (createAttachmentResponse.error) {
    return rep.status(400).send(createAttachmentResponse);
  }

  if (attachment64 != undefined && body.url != '') {
    uploadFile(attachment64, `${uuid}/${body.url}`);
  }

  return rep.status(201).send({ result: 'Attachment has been created.' });
};

export const updateAttachment = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const body: any = req.body;
  const attachment64 = body.attachment64;

  const {
    updateAttachmentResponse,
    getAttachmentUrlResponse,
  }: any = await attachmentService.updateRecord(
    body.uuid,
    body.url,
    body.comment_uuid
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
      const exists = checkIfExists(getAttachmentUrlResponse.rows[0].avatar);
      if (!exists.error) {
        await deleteFile(getAttachmentUrlResponse.rows[0].avatar);
      }
      uploadFile(attachment64, body.url);
    }
  }
};

export const deleteAttachment = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
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
  return rep.status(200).send({ result: 'Attachment deleted.' });
};
