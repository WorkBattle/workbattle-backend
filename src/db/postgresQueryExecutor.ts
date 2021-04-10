import pool from './postgresConnector';

export default async function postgresQueryExecutor(
  query: string,
  params: Array<any> = []
) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.log(error);
    return { error };
  } finally {
    client.release();
  }
}
