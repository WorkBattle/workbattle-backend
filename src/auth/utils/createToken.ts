import { sign } from 'jsonwebtoken';
export const createToken = (
  userUuid: string,
  expires: string,
  secret: string
) => {
  return sign({ userUuid: userUuid }, secret, { expiresIn: expires });
};
