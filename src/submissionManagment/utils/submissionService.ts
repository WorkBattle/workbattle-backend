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
    contest_type: string,
    user_uuid: string,
    contest_uuid: string,
    likes_uuid: string,
    contest_url?: string,
    file_url?: string,
    repo_url?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('submission', {
      uuid: uuid4(),
      contest_type: contest_type,
      user_uuid: user_uuid,
      contest_uuid,
      likes_uuid: likes_uuid,
      contest_url: contest_url,
      file_url: file_url,
      repo_url: repo_url,
    });
    const createRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return createRecordResponse;
  }
  public async updateRecord(
    uuid: string,
    contest_type?: string,
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
    } = constructUpdateQueryStringBasedOnParams(uuid, 'submission', {
      contest_type: contest_type,
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
  public async getAllRecords(contest_uuid: string, user_uuid: string) {
    const getRecordQuery: string = `SELECT * FROM submission where contest_uuid = $1 and user_uuid = $2`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      contest_uuid,
      user_uuid,
    ]);
    return getRecordResponse;
  }
}

export default new SubmissionService();
