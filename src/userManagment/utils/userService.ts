import IService from '../../utils/IService';
import {
  constractCreateQueryStringBasedOnParams,
  constractUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import { v4 as uuid4 } from 'uuid';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';
import { QueryResult } from 'pg';

class UserService implements IService {
  public async createRecord(
    username: string,
    email: string,
    password: string | null = null,
    firstname: string | null = null,
    lastname: string | null = null,
    role: string = 'user',
    balance: number = 0,
    avatar = ''
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constractCreateQueryStringBasedOnParams('"user"', {
      uuid: uuid4(),
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
    return createRecordResponse;
  }
  public async updateRecord(
    uuid: string,
    username: string | null = null,
    email: string | null = null,
    password: string | null = null,
    firstname: string | null = null,
    lastname: string | null = null,
    role: string = 'user',
    balance: number = 0,
    avatar: string | null = null
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constractUpdateQueryStringBasedOnParams('"user"', uuid, {
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
