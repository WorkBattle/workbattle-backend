import { compare } from 'bcryptjs';
import userService from '../../userManagment/utils/userService';

export const authenticateWithLoginEmail = async (
  password: string,
  username?: string,
  email?: string
) => {
  const getUserResponse: any = await userService.getRecord('', username, email);
  if (getUserResponse.error) {
    return { error: { status: 400, result: getUserResponse } };
  }
  if (getUserResponse.rows.length == 0) {
    return { error: { status: 404, result: 'User not found.' } };
  }
  const verifyPass = await compare(password, getUserResponse.rows[0].password);
  if (!verifyPass) {
    return { error: { status: 401, result: 'Invalid Password.' } };
  }
  return { user: getUserResponse.rows[0] };
};
