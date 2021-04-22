import IService from '../../utils/IService';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import { v4 as uuid4 } from 'uuid';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';
import { QueryResult } from 'pg';

class UserService implements IService {
  public async createRecord(
    username: string,
    email: string,
    password?: string,
    firstname?: string,
    lastname?: string,
    role: string = 'user',
    balance: number = 0,
    avatar = ''
  ) {
    const uuid = uuid4();
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('"user"', {
      uuid: uuid,
      username: username,
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      role: role,
      balance: balance,
      avatar: avatar,
    });
    const createRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return { uuid: uuid, createRecordResponse: createRecordResponse };
  }
  public async updateRecord(
    uuid: string,
    username?: string,
    email?: string,
    password?: string,
    firstname?: string,
    lastname?: string,
    role: string = 'user',
    balance: number = 0,
    avatar?: string
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams('"user"', uuid, {
      username: username,
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      role: role,
      balance: balance,
      avatar: avatar,
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
    const deleteRecordQuery: string = `DELETE FROM "user" WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return deleteRecordResponse;
  }
  public async getRecord(
    uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const getRecordQuery: string = `SELECT * FROM "user" WHERE uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      uuid,
    ]);
    return getRecordResponse;
  }
}

export default new UserService();
