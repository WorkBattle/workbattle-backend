export default interface IService {
  // Types for promise and mb several args - TBD status.
  createRecord(...args: any): Promise<any>;
  updateRecord(...args: any): Promise<any>;
  deleteRecord(...args: any): Promise<any>;
  getRecord(...args: any): Promise<any>;
}
