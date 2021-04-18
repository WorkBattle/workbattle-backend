import { QueryResult } from 'pg';

export default interface IService {
  // Types for promise and mb several args - TBD status.
  createRecord(...args: any): Promise<QueryResult<any> | { error: any }>;
  updateRecord(...args: any): Promise<QueryResult<any> | { error: any }>;
  deleteRecord(...args: any): Promise<QueryResult<any> | { error: any }>;
  getRecord(...args: any): Promise<QueryResult<any> | { error: any }>;
}
