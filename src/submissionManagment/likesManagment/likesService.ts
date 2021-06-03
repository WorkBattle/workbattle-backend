import { QueryResult } from 'pg';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import IService from '../../utils/IService';
import { v4 as uuid4 } from 'uuid';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';

class likesService implements IService {
  public async createRecord(likes: number, dislikes: number) {
    const uuid = uuid4();
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('likes_dislikes', {
      uuid: uuid,
      likes: likes,
      dislikes: dislikes,
    });
    const createRecordResponse: any = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return { createLikesResponse: createRecordResponse, uuid: uuid };
  }

  public async IsLikeOrDislike(
    likesDislikesUuid: string,
    userUuid: string,
    likes: boolean
  ) {
    const checkQuery = `SELECT * FROM ${
      likes ? 'likes' : 'dislikes'
    } WHERE likes_dislikes_uuid = $1 and user_uuid = $2;`;
    const checkResponse = await postgresQueryExecutor(checkQuery, [
      likesDislikesUuid,
      userUuid,
    ]);
    return checkResponse;
  }

  public async createLikesOrDislikesRecord(
    likesDislikesUuid: string,
    userUuid: string,
    likes: boolean
  ) {
    const uuid = uuid4();
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams(likes ? 'likes' : 'dislikes', {
      uuid: uuid,
      likes_dislikes_uuid: likesDislikesUuid,
      user_uuid: userUuid,
    });
    const createRecordResponse: any = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return createRecordResponse;
  }

  public async deleteLikesOrDislikeRecord(
    likesDislikesUuid: string,
    userUuid: string,
    likes: boolean
  ) {
    const deleteRecordQuery = `DELETE FROM ${
      likes ? 'likes' : 'dislikes'
    } WHERE likes_dislikes_uuid = $1 and user_uuid = $2;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [likesDislikesUuid, userUuid]
    );
    return deleteRecordResponse;
  }

  public async updateRecord(
    uuid: string,
    likes?: number,
    dislikes?: number
  ): Promise<QueryResult<any> | { error: any }> {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams('likes_dislikes', uuid, {
      likes: likes,
      dislikes: dislikes,
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
    const deleteRecordQuery = `DELETE FROM likes_dislikes WHERE uuid = $1;`;
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    return deleteRecordResponse;
  }
  public async getRecord(
    uuid: string
  ): Promise<QueryResult<any> | { error: any }> {
    const getRecordQuery: string = `SELECT * FROM likes_dislikes WHERE uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      uuid,
    ]);
    return getRecordResponse;
  }
}

export default new likesService();
