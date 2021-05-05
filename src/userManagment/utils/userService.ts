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
      avatar: avatar != '' ? `${uuid}/${avatar}` : avatar,
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
  ) {
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
    let getAvatarUrlResponse: any = '';
    if (avatar != undefined) {
      const getAvatarUrl: string = 'SELECT avatar from "user" WHERE uuid = $1;';
      getAvatarUrlResponse = await postgresQueryExecutor(getAvatarUrl, [uuid]);
    }
    const updateRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return {
      updateRecordResponse: updateRecordResponse,
      avatarUrlResponse: getAvatarUrlResponse,
    };
  }
  public async deleteRecord(uuid: string) {
    const getAvatarUrl: string = 'SELECT avatar from "user" WHERE uuid = $1;';
    const getAvatarUrlResponse: any = await postgresQueryExecutor(
      getAvatarUrl,
      [uuid]
    );
    const deleteRecordQuery: string = `DELETE FROM "user" WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return {
      deleteUserResponse: deleteRecordResponse,
      avatarUrl: getAvatarUrlResponse,
    };
  }
  public async getRecord(
    uuid: string,
    username?: string,
    email?: string
  ): Promise<any> {
    let getRecordResponse;
    if (uuid != '' && username == undefined) {
      const getRecordQuery: string = `SELECT * FROM "user" WHERE uuid = $1`;
      getRecordResponse = await postgresQueryExecutor(getRecordQuery, [uuid]);
    } else if (username != undefined) {
      const getRecordQuery: string = `SELECT * FROM "user" WHERE username = $1`;
      getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
        username,
      ]);
    } else if (email != undefined) {
      const getRecordQuery: string = `SELECT * FROM "user" WHERE email = $1`;
      getRecordResponse = await postgresQueryExecutor(getRecordQuery, [email]);
    }
    return getRecordResponse;
  }
}

export default new UserService();
