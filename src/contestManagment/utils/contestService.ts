import { QueryResult } from 'pg';
import IService from '../../utils/IService';
import { v4 as uuid4 } from 'uuid';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';

class ContestService implements IService {
  public async createRecord(
    title: string,
    description: string,
    task_description: string,
    closed: boolean,
    author_uuid: string,
    contestStart: Date,
    contestStop: Date,
    contestType: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('contest', {
      uuid: uuid4(),
      title: title,
      description: description,
      task_description: task_description,
      closed: closed,
      author_uuid: author_uuid,
      contest_start: contestStart,
      contest_stop: contestStop,
      contest_type: contestType,
    });
    const createRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return createRecordResponse;
  }
  public async updateRecord(
    uuid: string,
    title?: string,
    description?: string,
    task_description?: string,
    closed?: boolean,
    author_uuid?: string,
    contestStart?: Date,
    contestStop?: Date,
    contestType?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams(uuid, 'contest', {
      title: title,
      description: description,
      task_description: task_description,
      closed: closed,
      author_uuid: author_uuid,
      contest_start: contestStart,
      contest_stop: contestStop,
      contest_type: contestType,
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
    const deleteRecordQuery: string = `DELETE FROM contest WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return deleteRecordResponse;
  }
  public async getRecord(
    uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const getRecordQuery: string = `SELECT * FROM contest WHERE uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      uuid,
    ]);
    return getRecordResponse;
  }
  public async getAllRecords() {
    const getRecordQuery: string = `SELECT * FROM contest;`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery);
    return getRecordResponse;
  }
}

export default new ContestService();
