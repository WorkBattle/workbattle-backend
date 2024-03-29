import { FastifyRequest, FastifyReply } from 'fastify';
import submissionService from '../../submissionManagment/utils/submissionService';
import userService from '../../userManagment/utils/userService';
import contestService from '../utils/contestService';
import { toCamel } from 'snake-camel';
import likesService from '../../submissionManagment/likesManagment/likesService';

export const getContest = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const params: any = req.params;
  const getContestResponse: any = await contestService.getRecord(params.uuid);

  if (getContestResponse.error) {
    return rep.status(400).send(getContestResponse);
  }
  const getAllSubmissionsResponse: any = await submissionService.getAllRecords(
    params.uuid
  );
  if (getAllSubmissionsResponse.error) {
    return rep.status(400).send(getAllSubmissionsResponse);
  }
  let contestDetailsObject = getContestResponse.rows[0];
  let allSubmissions = getAllSubmissionsResponse.rows;
  allSubmissions = allSubmissions.map(async (submissionObject: any) => {
    const user_uuid = submissionObject.user_uuid;
    const getUserResponse: any = await userService.getRecord(user_uuid);
    if (getUserResponse.error) {
      return rep.status(400).send(getUserResponse);
    }
    let userData = getUserResponse.rows[0];
    delete userData.password;
    if (userData.avatar != '') {
      userData.avatar = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${userData.avatar}`;
    }
    submissionObject.user = userData;
    return submissionObject;
  });
  let awaitedSubmissions: any = [];
  for (let submission of allSubmissions) {
    let tempSub = await submission;
    const getLikesResponse: any = await likesService.getRecord(
      tempSub.likes_uuid
    );
    tempSub.likes = getLikesResponse.rows[0].likes;
    delete tempSub.likes_uuid;
    if (tempSub.file_url != undefined) {
      tempSub.file_url = `http://file-storage-workbattle.s3-website.eu-west-1.amazonaws.com/${tempSub.file_url}`;
    }
    awaitedSubmissions.push(toCamel(tempSub));
  }
  let contestResponse: { [key: string]: any } = {
    contest: toCamel(contestDetailsObject),
    submissionList: awaitedSubmissions,
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    contestResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(contestResponse);
};

export const getAllContests = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const getAllContestsResponse: any = await contestService.getAllRecords();
  if (getAllContestsResponse.error) {
    return rep.status(400).send(getAllContestsResponse);
  }
  let contestResponse: { [key: string]: any } = {
    contestList: getAllContestsResponse.rows.map((contest: any) =>
      toCamel(contest)
    ),
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    contestResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(contestResponse);
};

export const createContest = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const createContestReponse: any = await contestService.createRecord(
    body.title,
    body.description,
    body.taskDescription,
    body.closed,
    body.authorUuid,
    body.contestStart,
    body.contestStop,
    body.contestType
  );

  if (createContestReponse.error) {
    return rep.status(400).send(createContestReponse);
  }
  let contestResponse: { [key: string]: any } = {
    result: 'Created contest.',
  };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    contestResponse['token'] = accessToken.access;
  }
  return rep.status(201).send(contestResponse);
};

export const updateContest = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const body: any = req.body;
  const updateContestResponse: any = await contestService.updateRecord(
    body.uuid,
    body.title,
    body.description,
    body.taskDescription,
    body.closed,
    body.authorUuid,
    body.contestStart,
    body.contestStop,
    body.contestType
  );
  if (updateContestResponse.error) {
    return rep.status(400).send(updateContestResponse);
  }
  let contestResponse: { [key: string]: any } = { result: 'Contest Updated.' };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    contestResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(contestResponse);
};

export const deleteContest = async (req: any, rep: FastifyReply) => {
  rep.header('Access-Control-Allow-Credentials', 'true');
  const params: any = req.params;
  const deleteContestResponse: any = await contestService.deleteRecord(
    params.uuid
  );
  if (deleteContestResponse.error) {
    return rep.status(400).send(deleteContestResponse);
  }
  let contestResponse: { [key: string]: any } = { result: 'Contest Deleted.' };
  const accessToken = req.requestContext.get('token');
  if (accessToken != undefined) {
    contestResponse['token'] = accessToken.access;
  }
  return rep.status(200).send(contestResponse);
};
