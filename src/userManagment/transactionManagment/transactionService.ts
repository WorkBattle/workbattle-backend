import { QueryResult } from 'pg';
import { v4 as uuid4 } from 'uuid';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import IService from '../../utils/IService';

class transactionService implements IService {
  public async createRecord(
    date: Date,
    info: string,
    user_uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('transactions', {
      uuid: uuid4(),
      date: date,
      info: info,
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
    date?: Date,
    info?: string,
    user_uuid?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams('transactions', uuid, {
      date: date,
      info: info,
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
    const deleteRecordQuery = `DELETE FROM transactions WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return deleteRecordResponse;
  }
  public async getRecord(
    uuid: string,
    user_uuid?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const getRecordQuery = `SELECT * FROM transactions WHERE ${
      user_uuid != null ? 'user_uuid' : 'uuid'
    } = $1;`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      user_uuid ?? uuid,
    ]);
    return getRecordResponse;
  }
  public async getAllRecords() {
    const getRecordQuery: string = `SELECT * FROM transactions`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery);
    return getRecordResponse;
  }
}

export default new transactionService();
