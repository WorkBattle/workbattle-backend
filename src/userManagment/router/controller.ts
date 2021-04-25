import { FastifyRequest, FastifyReply } from 'fastify';
import { checkIfExists, deleteFile, uploadFile } from '../../aws/fileUtils';
import userService from '../utils/userService';

export const getUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const params: any = req.params;
  const userUuid = params.uuid;
  const getUserResponse: any = await userService.getRecord(userUuid);
  if (getUserResponse.error) {
    return rep.status(400).send(getUserResponse);
  }
  return { user: getUserResponse.rows[0] };
};

export const createUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;

  const avatarBase64 = body.avatar64;
  const avatarUrl = body.avatarUrl;

  const { uuid, createRecordResponse }: any = await userService.createRecord(
    body.username,
    body.email,
    body.password,
    body.firstname,
    body.lastname,
    body.role,
    body.balance,
    avatarUrl
  );
  if (createRecordResponse.error) {
    return rep.status(400).send(createRecordResponse);
  }
  if (avatarBase64 != undefined && avatarUrl != '') {
    uploadFile(avatarBase64, `${uuid}/${avatarUrl}`);
  }
  return rep.status(201).send({ result: 'User has been created.' });
};

export const updateUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const body: any = req.body;

  const avatarBase64 = body.avatar64;
  const avatarUrl = body.avatarUrl;

  const {
    updateRecordResponse,
    avatarUrlResponse,
  }: any = await userService.updateRecord(
    body.uuid,
    body.username,
    body.email,
    body.password,
    body.firstname,
    body.lastname,
    body.role,
    body.balance,
    avatarUrl
  );
  if (updateRecordResponse.error) {
    return rep.status(400).send(updateRecordResponse);
  }
  if (avatarUrlResponse.error) {
    return rep.status(400).status(avatarUrlResponse);
  }
  if (avatarUrl == '') {
    try {
      await deleteFile(avatarUrl);
    } catch (err) {
      return rep.status(400).send(err.code);
    }
  } else {
    if (avatarBase64 != undefined) {
      const exists = checkIfExists(avatarUrlResponse.rows[0].avatar);
      if (!exists.error) {
        await deleteFile(avatarUrlResponse.rows[0].avatar);
      }
      uploadFile(avatarBase64, avatarUrl);
    }
  }
  return rep.status(200).send({ result: 'User updated.' });
};

export const deleteUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const params: any = req.params;
  const { deleteUserResponse, avatarUrl }: any = await userService.deleteRecord(
    params.uuid
  );
  if (deleteUserResponse.error) {
    return rep.status(400).send(deleteUserResponse);
  }
  if (avatarUrl.error) {
    return rep.status(400).send(avatarUrl);
  }
  if (avatarUrl.rows[0].avatar != '') {
    await deleteFile(avatarUrl.rows[0].avatar);
  }
  return rep.status(200).send({ result: 'User deleted.' });
};
