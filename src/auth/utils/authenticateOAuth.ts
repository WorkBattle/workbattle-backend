import axios from 'axios';
import userService from '../../userManagment/utils/userService';

export const authenticateWithGit = async (requestToken: string) => {
  const getAccessTokenResponse = await axios.post(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GIT_CLIENT}&client_secret=${process.env.GIT_SECRET}&code=${requestToken}`,
    undefined,
    { headers: { accept: 'application/json' } }
  );
  const accessToken = JSON.parse(JSON.stringify(getAccessTokenResponse.data))
    .access_token;

  const getGitUserData = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + accessToken,
    },
  });

  const gitUserData = JSON.parse(JSON.stringify(getGitUserData));

  const getUserResponse = await userService.getRecord(
    '',
    undefined,
    undefined,
    gitUserData.data.login
  );
  if (getUserResponse.error) {
    return { error: { status: 400, result: getUserResponse } };
  }
  if (getUserResponse.rows.length == 0) {
    let email = gitUserData.email;
    let firstname;
    let lastname;
    if (gitUserData.name) {
      let splitedName = gitUserData.split(' ');
      if (splitedName.length != 1) {
        firstname = splitedName[0];
        lastname = splitedName.slice(1).join(' ');
      } else {
        firstname = splitedName[0];
      }
    }
    const checkIfUsernameExists = await userService.getRecord(
      '',
      gitUserData.data.login
    );
    if (checkIfUsernameExists.error) {
      return { error: { status: 4000, result: checkIfUsernameExists } };
    }
    const { uuid, createRecordResponse }: any = await userService.createRecord(
      checkIfUsernameExists.rows.length == 0
        ? gitUserData.data.login
        : Math.floor(1000 + Math.random() * 9000),
      email,
      undefined,
      firstname,
      lastname,
      'user',
      0,
      '',
      gitUserData.data.login
    );
    if (createRecordResponse.error) {
      return { error: { code: 400, result: createRecordResponse } };
    }
    return { user: { uuid: uuid } };
  }
  return { user: getUserResponse.rows[0] };
};
