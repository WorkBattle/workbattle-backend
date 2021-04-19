import { FastifyRequest, FastifyReply } from 'fastify';
import attachmentService from '../attachmentService';

export const getAllAttachments = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const params: any = req.params;
  const getUserResponse: any = await attachmentService.getAllRecords(
    params.user_uuid
  );
  if (getUserResponse.error) {
    return rep.status(400).send(getUserResponse);
  }
  return { contestList: getUserResponse.rows[0] };
};

export const createAttachment = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const body: any = req.body;
  const createAttachmentResponse: any = await attachmentService.createRecord(
    body.url,
    body.user_uuid
  );
  if (createAttachmentResponse.error) {
    return rep.status(400).send(createAttachmentResponse);
  }

  return rep.status(201).send({ result: 'Attachment has been created.' });
};
