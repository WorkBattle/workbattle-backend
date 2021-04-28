import { QueryResult } from 'pg';
import {
  constructCreateQueryStringBasedOnParams,
  constructUpdateQueryStringBasedOnParams,
} from '../../utils/CRUDUtils';
import { v4 as uuid4 } from 'uuid';
import IService from '../../utils/IService';
import postgresQueryExecutor from '../../db/postgresQueryExecutor';

class attachmentService implements IService {
  public async createRecord(url: string, comment_uuid: string) {
    const uuid = uuid4();
    const {
      queryString,
      valuesArray,
    } = constructCreateQueryStringBasedOnParams('attachments', {
      uuid: uuid,
      url: url,
      comment_uuid: comment_uuid,
    });
    const createRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return { createRecordResponse, uuid };
  }
  public async updateRecord(uuid: string, url?: string, comment_uuid?: string) {
    const {
      queryString,
      valuesArray,
    } = constructUpdateQueryStringBasedOnParams(uuid, 'attachment', {
      url: url,
      comment_uuid: comment_uuid,
    });
    let getAttachmentUrlResponse: any = '';
    if (url != undefined) {
      const getAttachmentUrl = 'SELECT url FROM attachment WHERE uuid = $1;';
      getAttachmentUrlResponse = await postgresQueryExecutor(getAttachmentUrl, [
        uuid,
      ]);
    }
    const updateRecordResponse = await postgresQueryExecutor(
      queryString,
      valuesArray
    );
    return { updateRecordResponse, getAttachmentUrlResponse };
  }
  public async deleteRecord(uuid: string) {
    const deleteRecordQuery = `DELETE FROM attachment WHERE uuid = $1;`;
    const getUrlQuery = 'SELECT url FROM attachment WHERE uuid = $1;';
    const deleteRecordResponse = await postgresQueryExecutor(
      deleteRecordQuery,
      [uuid]
    );
    const getUrlResponse = await postgresQueryExecutor(getUrlQuery, [uuid]);
    return { deleteRecordResponse, getUrlResponse };
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
  public async getAllRecords(uuid: string) {
    const getRecordQuery: string = `SELECT * FROM attachment WHERE comment_uuid = $1`;
    const getRecordResponse = await postgresQueryExecutor(getRecordQuery, [
      uuid,
    ]);
    return getRecordResponse;
  }
}

export default new attachmentService();
