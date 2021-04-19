import { QueryResult } from 'pg';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import IService from '../../utils/IService';
import { v4 as uuid4 } from 'uuid';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';

class commentsService implements IService {
  public async createRecord(
    text: string,
    submission_uuid: string,
    user_uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('comments', {
      uuid: uuid4(),
      text: text,
      submission_uuid: submission_uuid,
      user_uuid: user_uuid,
    });
    const createRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return createRecordResponse;
  }
  public async updateRecord(
    uuid: string,
    text?: string,
    submission_uuid?: string,
    user_uuid?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams(uuid, 'comments', {
      text: text,
      submission_uuid: submission_uuid,
      user_uuid: user_uuid,
    });
    const updateRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return updateRecordResponse;
  }
  public async deleteRecord(
    uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const deleteRecordQuery = `DELETE FROM comments WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return deleteRecordResponse;
  }
  public async getRecord(
    uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const getRecordQuery: string = `SELECT * FROM comments WHERE uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      uuid,
    ]);
    return getRecordResponse;
  }
  public async getAllRecords(submission_uuid: string, user_uuid: string) {
    const getRecordQuery: string = `SELECT * FROM comments where submission_uuid = $1 and user_uuid = $2`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      submission_uuid,
      user_uuid,
    ]);
    return getRecordResponse;
  }
}

export default new commentsService();
