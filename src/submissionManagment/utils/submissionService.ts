import { QueryResult } from 'pg';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import IService from '../../utils/IService';
import { v4 as uuid4 } from 'uuid';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';

class SubmissionService implements IService {
  public async createRecord(
    content_type: string,
    user_uuid: string,
    contest_uuid: string,
    likes_uuid: string,
    content_url?: string,
    file_url?: string,
    repo_url?: string
  ) {
    const submissionUuid = uuid4();
    let fileUrl = file_url;
    if (file_url != undefined) {
      fileUrl = `${submissionUuid}.${file_url}`;
    }
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('submission', {
      uuid: submissionUuid,
      content_type: content_type,
      user_uuid: user_uuid,
      contest_uuid,
      likes_uuid: likes_uuid,
      content_url: content_url,
      file_url: fileUrl,
      repo_url: repo_url,
    });
    const createRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return { submissionUuid, createRecordResponse };
  }
  public async updateRecord(
    uuid: string,
    content_type?: string,
    user_uuid?: string,
    contest_uuid?: string,
    likes_uuid?: string,
    contest_url?: string,
    file_url?: string,
    repo_url?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams('submission', uuid, {
      content_type: content_type,
      user_uuid: user_uuid,
      contest_uuid,
      likes_uuid: likes_uuid,
      contest_url: contest_url,
      file_url: file_url,
      repo_url: repo_url,
    });
    const updateRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return updateRecordResponse;
  }
  public async deleteRecord(uuid: string) {
    const getLikesUUID = `SELECT likes_uuid FROM submission WHERE uuid = $1;`;
    const getLikesUUIDResponse = await postgresQueryExecutor(getLikesUUID, [
      uuid,
    ]);
    const deleteRecordQuery = `DELETE FROM submission WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return {
      deleteSubmissionResponse: deleteRecordResponse,
      getLikesUUIDResponse: getLikesUUIDResponse,
    };
  }
  public async getRecord(
    uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const getRecordQuery: string = `SELECT * FROM submission WHERE uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      uuid,
    ]);
    return getRecordResponse;
  }
  public async getAllRecords(contest_uuid: string) {
    const getRecordQuery: string = `SELECT * FROM submission where contest_uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      contest_uuid,
    ]);
    return getRecordResponse;
  }
}

export default new SubmissionService();
