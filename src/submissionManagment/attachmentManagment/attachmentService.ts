import { QueryResult } from 'pg';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import { v4 as uuid4 } from 'uuid';
import IService from '../../utils/IService';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';

class attachmentService implements IService {
  public async createRecord(
    url: string,
    user_uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('attachments', {
      uuid: uuid4(),
      url: url,
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
    url?: string,
    user_uuid?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams(uuid, 'attachment', {
      url: url,
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
    const deleteRecordQuery = `DELETE FROM attachment WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return deleteRecordResponse;
  }
  public async getRecord(
    uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const getRecordQuery: string = `SELECT * FROM attachment WHERE uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      uuid,
    ]);
    return getRecordResponse;
  }
}

export default new attachmentService();
